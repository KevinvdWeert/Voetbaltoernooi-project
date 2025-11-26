<?php
require_once 'includes/init.php';
require_once 'includes/header.php';
?>

<main>
    <!-- Hero Section -->
    <section class="hero-section">
        <canvas id="hero-canvas"></canvas>
        <div class="hero-overlay"></div>
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title animate-fade-in">Welkom bij Voetbaltoernooi Management</h1>
                <p class="hero-subtitle animate-fade-in-delay">Het ultieme platform voor het beheren en volgen van voetbaltoernooien</p>
                <div class="hero-buttons animate-fade-in-delay-2">
                    <a href="./teams.php" class="btn btn-primary btn-lg"><i class="fas fa-users"></i> Bekijk Teams</a>
                    <a href="./matches.php" class="btn btn-outline-light btn-lg"><i class="fas fa-calendar-alt"></i> Wedstrijden</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
        <div class="container">
            <h2 class="section-title text-center">Wat Bieden Wij?</h2>
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-users-cog"></i>
                        </div>
                        <h3>Team Management</h3>
                        <p>Beheer eenvoudig teams, spelers en hun statistieken. Voeg nieuwe teams toe en volg hun prestaties.</p>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <h3>Wedstrijd Planning</h3>
                        <p>Plan wedstrijden, stel locaties in en houd bij welke wedstrijden zijn gespeeld of nog komen.</p>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <h3>Live Uitslagen</h3>
                        <p>Volg live scores en bekijk gedetailleerde statistieken van alle wedstrijden in real-time.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
        <div class="container">
            <div class="row text-center">
                <?php
                $pdo = getDbConnection();

                // Count teams
                $teamCount = $pdo->query("SELECT COUNT(*) FROM teams")->fetchColumn();

                // Count matches
                $matchCount = $pdo->query("SELECT COUNT(*) FROM matches")->fetchColumn();

                // Count players
                $playerCount = $pdo->query("SELECT COUNT(*) FROM team_players")->fetchColumn();

                // Count finished matches
                $finishedMatches = $pdo->query("SELECT COUNT(*) FROM matches WHERE status = 'finished'")->fetchColumn();
                ?>
                <div class="col-md-3 col-6 mb-4">
                    <div class="stat-card">
                        <i class="fas fa-users stat-icon"></i>
                        <h3 class="stat-number"><?php echo $teamCount; ?></h3>
                        <p class="stat-label">Teams</p>
                    </div>
                </div>
                <div class="col-md-3 col-6 mb-4">
                    <div class="stat-card">
                        <i class="fas fa-futbol stat-icon"></i>
                        <h3 class="stat-number"><?php echo $matchCount; ?></h3>
                        <p class="stat-label">Wedstrijden</p>
                    </div>
                </div>
                <div class="col-md-3 col-6 mb-4">
                    <div class="stat-card">
                        <i class="fas fa-user-friends stat-icon"></i>
                        <h3 class="stat-number"><?php echo $playerCount; ?></h3>
                        <p class="stat-label">Spelers</p>
                    </div>
                </div>
                <div class="col-md-3 col-6 mb-4">
                    <div class="stat-card">
                        <i class="fas fa-check-circle stat-icon"></i>
                        <h3 class="stat-number"><?php echo $finishedMatches; ?></h3>
                        <p class="stat-label">Afgerond</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
        <div class="container text-center">
            <h2 class="cta-title">Klaar om te Beginnen?</h2>
            <p class="cta-text">Meld je aan en start vandaag nog met het beheren van jouw toernooi</p>
            <a href="./login.php" class="btn btn-light btn-lg"><i class="fas fa-rocket"></i> Start Nu</a>
        </div>
    </section>
</main>

<?php require_once 'includes/footer.php'; ?>