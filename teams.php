<?php 
require_once 'includes/init.php';
require_once 'includes/header.php'; 
?>

<main>
    <div class="page-header">
        <div class="container">
            <h1><i class="fas fa-users"></i> Teams Overzicht</h1>
            <p>Ontdek alle deelnemende teams aan het toernooi</p>
        </div>
    </div>

    <div class="container mt-5">
        <div class="teams-grid">
            <?php
            $pdo = getDbConnection();

            $stmt = $pdo->query("SELECT t.id, t.name, t.created_at, u.name AS captain_name,
                                 (SELECT COUNT(*) FROM team_players tp WHERE tp.team_id = t.id) as player_count
                                 FROM teams t
                                 LEFT JOIN users u ON t.captain_id = u.id
                                 ORDER BY t.name ASC");
            $teams = $stmt->fetchAll();

            if ($teams):
                foreach ($teams as $team): ?>
                    <div class="team-card-modern">
                        <div class="team-card-header">
                            <div class="team-badge">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                        </div>
                        <div class="team-card-body">
                            <h3 class="team-card-title"><?php echo htmlspecialchars($team['name']); ?></h3>
                            <div class="team-info">
                                <div class="info-item">
                                    <i class="fas fa-user-tie"></i>
                                    <span>Aanvoerder: <?php echo htmlspecialchars($team['captain_name'] ?? 'Niet toegewezen'); ?></span>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-users"></i>
                                    <span><?php echo $team['player_count']; ?> Spelers</span>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-calendar-plus"></i>
                                    <span>Sinds <?php echo date("d M Y", strtotime($team['created_at'])); ?></span>
                                </div>
                            </div>
                        </div>
                        <div class="team-card-footer">
                            <a href="./team-details.php?id=<?php echo $team['id']; ?>" class="btn btn-primary btn-block">
                                <i class="fas fa-eye"></i> Bekijk Team
                            </a>
                        </div>
                    </div>
                <?php endforeach;
            else: ?>
                <div class="no-data col-12">
                    <i class="fas fa-users-slash"></i>
                    <p>Geen teams gevonden</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</main>

<?php require_once 'includes/footer.php'; ?>