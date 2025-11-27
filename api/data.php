<?php
require_once '../includes/init.php';

$action = $_GET['action'] ?? '';

try {
    $pdo = getDbConnection();
    
    switch($action) {
        case 'teams':
            $stmt = $pdo->query("SELECT t.id, t.name, t.created_at, u.name AS captain_name,
                                 (SELECT COUNT(*) FROM team_players tp WHERE tp.team_id = t.id) as player_count
                                 FROM teams t
                                 LEFT JOIN users u ON t.captain_id = u.id
                                 ORDER BY t.name ASC");
            $teams = $stmt->fetchAll(PDO::FETCH_ASSOC);
            jsonResponse(true, $teams);
            break;
            
        case 'team':
            $id = intval($_GET['id'] ?? 0);
            if ($id > 0) {
                $stmt = $pdo->prepare("SELECT t.*, u.name AS captain_name,
                                       (SELECT COUNT(*) FROM team_players tp WHERE tp.team_id = t.id) as player_count
                                       FROM teams t
                                       LEFT JOIN users u ON t.captain_id = u.id
                                       WHERE t.id = ?");
                $stmt->execute([$id]);
                $team = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($team) {
                    // Get players
                    $stmt = $pdo->prepare("SELECT tp.id, tp.name, tp.jersey_number, tp.user_id
                                          FROM team_players tp
                                          WHERE tp.team_id = ?");
                    $stmt->execute([$id]);
                    $team['players'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    
                    // Get matches
                    $stmt = $pdo->prepare("SELECT m.*, 
                                          t1.name as team_a_name, 
                                          t2.name as team_b_name
                                          FROM matches m
                                          JOIN teams t1 ON m.team_a_id = t1.id
                                          JOIN teams t2 ON m.team_b_id = t2.id
                                          WHERE m.team_a_id = ? OR m.team_b_id = ?
                                          ORDER BY m.match_date DESC
                                          LIMIT 5");
                    $stmt->execute([$id, $id]);
                    $team['matches'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    
                    jsonResponse(true, $team);
                } else {
                    jsonResponse(false, null, ['message' => 'Team niet gevonden'], 404);
                }
            } else {
                jsonResponse(false, null, ['message' => 'Ongeldig team ID'], 400);
            }
            break;
            
        case 'matches':
            $stmt = $pdo->query("SELECT m.id, t1.name AS team1, t2.name AS team2, m.match_date, m.field,
                                 m.status, m.team_a_score, m.team_b_score, m.team_a_id, m.team_b_id
                                 FROM matches m
                                 JOIN teams t1 ON m.team_a_id = t1.id
                                 JOIN teams t2 ON m.team_b_id = t2.id
                                 ORDER BY m.match_date DESC");
            $matches = $stmt->fetchAll(PDO::FETCH_ASSOC);
            // Derive 'live' status for scheduled matches within a 2h window after start until finished/cancelled
            $nowTs = time();
            foreach ($matches as &$m) {
                if ($m['status'] === 'scheduled') {
                    $startTs = strtotime($m['match_date']);
                    if ($startTs <= $nowTs && ($nowTs - $startTs) <= 7200) { // 2 hours
                        $m['status'] = 'live';
                    }
                }
            }
            jsonResponse(true, $matches);
            break;
            
        case 'match':
            $id = intval($_GET['id'] ?? 0);
            if ($id > 0) {
                $stmt = $pdo->prepare("SELECT m.*, 
                                      t1.name as team_a_name, 
                                      t2.name as team_b_name
                                      FROM matches m
                                      JOIN teams t1 ON m.team_a_id = t1.id
                                      JOIN teams t2 ON m.team_b_id = t2.id
                                      WHERE m.id = ?");
                $stmt->execute([$id]);
                $match = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($match) {
                    jsonResponse(true, $match);
                } else {
                    jsonResponse(false, null, ['message' => 'Match not found'], 404);
                }
            } else {
                jsonResponse(false, null, ['message' => 'Invalid match ID'], 400);
            }
            break;
            
        case 'stats':
            $teamCount = $pdo->query("SELECT COUNT(*) FROM teams")->fetchColumn();
            $matchCount = $pdo->query("SELECT COUNT(*) FROM matches")->fetchColumn();
            $playerCount = $pdo->query("SELECT COUNT(*) FROM team_players")->fetchColumn();
            $finishedMatches = $pdo->query("SELECT COUNT(*) FROM matches WHERE status = 'finished'")->fetchColumn();
            
            jsonResponse(true, [
                'teams' => $teamCount,
                'matches' => $matchCount,
                'players' => $playerCount,
                'finished' => $finishedMatches
            ]);
            break;
            
        case 'search':
            // Accept both 'q' and 'query'
            $queryRaw = $_GET['query'] ?? ($_GET['q'] ?? '');
            $query = trim($queryRaw);
            
            // Validate input length
            if (strlen($query) < 2) {
                jsonResponse(false, null, ['message' => 'Search term must be at least 2 characters'], 400);
            }
            if (strlen($query) > 100) {
                jsonResponse(false, null, ['message' => 'Search term too long (max 100 characters)'], 400);
            }
            
            // Sanitize: remove special SQL characters that could be problematic
            $query = preg_replace('/[%_\\\\]/', '', $query);
            $searchPattern = '%' . $query . '%';
            
            $limit = min((int)($_GET['limit'] ?? 10), 50); // Max 50 results
            $results = ['teams' => [], 'matches' => [], 'players' => []];
            
            // Search teams
            $stmt = $pdo->prepare("SELECT id, name, 'team' as type FROM teams WHERE name LIKE ? LIMIT ?");
            $stmt->bindValue(1, $searchPattern, PDO::PARAM_STR);
            $stmt->bindValue(2, $limit, PDO::PARAM_INT);
            $stmt->execute();
            $results['teams'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Search matches
            $stmt = $pdo->prepare("SELECT m.id, m.match_date, t1.name as team_a_name, t2.name as team_b_name, 'match' as type
                                  FROM matches m
                                  JOIN teams t1 ON m.team_a_id = t1.id
                                  JOIN teams t2 ON m.team_b_id = t2.id
                                  WHERE t1.name LIKE ? OR t2.name LIKE ?
                                  LIMIT ?");
            $stmt->bindValue(1, $searchPattern, PDO::PARAM_STR);
            $stmt->bindValue(2, $searchPattern, PDO::PARAM_STR);
            $stmt->bindValue(3, $limit, PDO::PARAM_INT);
            $stmt->execute();
            $results['matches'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Search players
            $stmt = $pdo->prepare("SELECT tp.id, tp.name, t.name as team_name, 'player' as type
                                  FROM team_players tp
                                  JOIN teams t ON tp.team_id = t.id
                                  WHERE tp.name LIKE ?
                                  LIMIT ?");
            $stmt->bindValue(1, $searchPattern, PDO::PARAM_STR);
            $stmt->bindValue(2, $limit, PDO::PARAM_INT);
            $stmt->execute();
            $results['players'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            jsonResponse(true, $results);
            break;
            
        default:
            jsonResponse(false, null, ['message' => 'Invalid action'], 400);
    }
} catch (Exception $e) {
    jsonResponse(false, null, ['message' => 'Internal error', 'detail' => APP_ENV==='local' ? $e->getMessage() : null], 500);
}
