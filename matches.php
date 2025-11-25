<?php 
require_once 'includes/init.php';
require_once 'includes/header.php'; 
?>

<main>
    <div class="page-header">
        <div class="container">
            <h1><i class="fas fa-calendar-alt"></i> Wedstrijden Overzicht</h1>
            <p>Bekijk alle geplande en afgeronde wedstrijden</p>
        </div>
    </div>

    <div class="container mt-5">
        <!-- Filter Tabs -->
        <ul class="nav nav-pills justify-content-center mb-4" id="matchFilter">
            <li class="nav-item">
                <a class="nav-link active" data-filter="all" href="#"><i class="fas fa-list"></i> Alle</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-filter="scheduled" href="#"><i class="fas fa-clock"></i> Gepland</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-filter="finished" href="#"><i class="fas fa-check"></i> Afgerond</a>
            </li>
        </ul>

        <div class="matches-grid">
            <?php
            $pdo = getDbConnection();

            $stmt = $pdo->query("SELECT m.id, t1.name AS team1, t2.name AS team2, m.match_date, m.field, 
                                 m.status, m.team_a_score, m.team_b_score
                                 FROM matches m
                                 JOIN teams t1 ON m.team_a_id = t1.id
                                 JOIN teams t2 ON m.team_b_id = t2.id
                                 ORDER BY m.match_date DESC");
            $matches = $stmt->fetchAll();

            if ($matches):
                foreach ($matches as $match): 
                    $statusClass = $match['status'] == 'finished' ? 'finished' : 'scheduled';
                    $statusIcon = $match['status'] == 'finished' ? 'fa-check-circle' : 'fa-clock';
                    $statusText = $match['status'] == 'finished' ? 'Afgerond' : 'Gepland';
                    ?>
                    <div class="match-card-modern" data-status="<?php echo $match['status']; ?>">
                        <div class="match-header">
                            <span class="match-status <?php echo $statusClass; ?>">
                                <i class="fas <?php echo $statusIcon; ?>"></i> <?php echo $statusText; ?>
                            </span>
                            <span class="match-date">
                                <i class="far fa-calendar"></i> <?php echo date("d M Y", strtotime($match['match_date'])); ?>
                            </span>
                        </div>
                        <div class="match-body">
                            <div class="team-section">
                                <div class="team-logo">
                                    <i class="fas fa-shield-alt"></i>
                                </div>
                                <h3 class="team-name"><?php echo htmlspecialchars($match['team1']); ?></h3>
                            </div>
                            <div class="match-score">
                                <?php if ($match['status'] == 'finished'): ?>
                                    <div class="score">
                                        <span class="score-number"><?php echo $match['team_a_score']; ?></span>
                                        <span class="score-divider">-</span>
                                        <span class="score-number"><?php echo $match['team_b_score']; ?></span>
                                    </div>
                                <?php else: ?>
                                    <div class="vs-text">VS</div>
                                    <div class="match-time"><?php echo date("H:i", strtotime($match['match_date'])); ?></div>
                                <?php endif; ?>
                            </div>
                            <div class="team-section">
                                <div class="team-logo">
                                    <i class="fas fa-shield-alt"></i>
                                </div>
                                <h3 class="team-name"><?php echo htmlspecialchars($match['team2']); ?></h3>
                            </div>
                        </div>
                        <div class="match-footer">
                            <span class="match-location">
                                <i class="fas fa-map-marker-alt"></i> <?php echo htmlspecialchars($match['field'] ?? 'TBD'); ?>
                            </span>
                            <a href="./match-details.php?id=<?php echo $match['id']; ?>" class="btn btn-sm btn-primary">
                                <i class="fas fa-info-circle"></i> Details
                            </a>
                        </div>
                    </div>
                <?php endforeach;
            else: ?>
                <div class="no-data">
                    <i class="fas fa-calendar-times"></i>
                    <p>Geen wedstrijden gevonden</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</main>

<?php require_once 'includes/footer.php'; ?>