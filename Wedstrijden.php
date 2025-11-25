<?php 
require_once 'includes/init.php';
require_once 'includes/header.php'; 
?>

<main class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Wedstrijden</h1>
    <div class="matches-list space-y-6">
        <?php
        // Get database connection
        $pdo = getDbConnection();

        // Fetch matches from the database
        $stmt = $pdo->query("SELECT m.id, t1.name AS team1, t2.name AS team2, m.match_date, m.location 
                             FROM matches m
                             JOIN teams t1 ON m.team1_id = t1.id
                             JOIN teams t2 ON m.team2_id = t2.id
                             ORDER BY m.match_date ASC");
        $matches = $stmt->fetchAll();

        if ($matches):
            foreach ($matches as $match): ?>
                <div class="match-card p-4 border rounded-lg shadow-sm bg-white">
                    <h2 class="text-xl font-semibold mb-2"><?php echo htmlspecialchars($match['team1']); ?> vs <?php echo htmlspecialchars($match['team2']); ?></h2>
                    <p class="text-gray-600">Datum: <?php echo date("d-m-Y H:i", strtotime($match['match_date'])); ?></p>
                    <p class="text-gray-600">Locatie: <?php echo htmlspecialchars($match['location']); ?></p>
                </div>
            <?php endforeach;
        else: ?>
            <p>Geen wedstrijden gevonden.</p>
        <?php endif; ?>
    </div>
</main>

<?php require_once 'includes/footer.php'; ?>