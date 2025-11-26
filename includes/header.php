<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Beheer je voetbaltoernooi eenvoudig met ons management systeem. Volg teams, wedstrijden, en uitslagen in real-time.">
    <meta name="keywords" content="voetbaltoernooi, toernooi beheer, voetbal management, wedstrijden, teams, uitslagen">
    <meta name="author" content="Voetbaltoernooi Project">
    <meta name="robots" content="index, follow">

    <meta property="og:type" content="website">
    <meta property="og:title" content="Voetbaltoernooi Management Systeem">
    <meta property="og:description" content="Beheer je voetbaltoernooi eenvoudig met ons management systeem. Volg teams, wedstrijden, en uitslagen in real-time.">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Voetbaltoernooi Management Systeem">
    <meta name="twitter:description" content="Beheer je voetbaltoernooi eenvoudig met ons management systeem. Volg teams, wedstrijden, en uitslagen in real-time.">

    <title>Voetbaltoernooi Management Systeem | Teams & Wedstrijden</title>
    <link rel="icon" type="image/x-icon" href="./assets/img/favicon.ico">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="./assets/css/style.css">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="./assets/js/script.js" defer></script>
</head>

<body>
    <header class="site-header">
        <!-- Top Navigation Bar -->
        <nav class="top-navbar">
            <div class="container-fluid">
                <div class="d-flex justify-content-between align-items-center">
                    <!-- Logo -->
                    <a class="navbar-brand" href="./index.php">
                        <i class="fas fa-futbol"></i>
                        <strong>VOETBALTOERNOOI</strong>
                    </a>

                    <!-- Right Side Actions -->
                    <div class="top-nav-actions">
                        <!-- Search -->
                        <button class="top-nav-btn" id="searchToggle" title="Zoeken">
                            <i class="fas fa-search"></i>
                        </button>

                        <!-- Profile / Login -->
                        <?php if (isset($_SESSION['user_id'])): ?>
                            <a href="./profile.php" class="top-nav-btn" title="Profiel">
                                <i class="fas fa-user"></i>
                                <span class="btn-text">PROFIEL</span>
                            </a>
                        <?php else: ?>
                            <a href="./login.php" class="top-nav-btn" title="Inloggen">
                                <i class="fas fa-sign-in-alt"></i>
                                <span class="btn-text">LOGIN</span>
                            </a>
                        <?php endif; ?>

                        <!-- Settings Dropdown -->
                        <div class="dropdown d-inline-block">
                            <button class="top-nav-btn dropdown-toggle" type="button" id="settingsDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Menu">
                                <i class="fas fa-bars"></i>
                            </button>
                            <div class="dropdown-menu dropdown-menu-right settings-dropdown" aria-labelledby="settingsDropdown">
                                <?php if (isset($_SESSION['user_id'])): ?>
                                    <a class="dropdown-item" href="./profile.php">
                                        <i class="fas fa-user dropdown-icon"></i> Mijn Profiel
                                    </a>
                                    <div class="dropdown-divider"></div>
                                <?php endif; ?>
                                <a class="dropdown-item" href="./settings.php">
                                    <i class="fas fa-cog dropdown-icon"></i> Instellingen
                                </a>
                                <a class="dropdown-item" href="./contact.php">
                                    <i class="fas fa-envelope dropdown-icon"></i> Contact
                                </a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item dark-mode-toggle" href="#" id="darkModeToggle">
                                    <i class="fas fa-moon dropdown-icon"></i>
                                    <span id="darkModeText">Donkere modus</span>
                                    <span class="toggle-switch" id="toggleSwitch">
                                        <span class="toggle-slider"></span>
                                    </span>
                                </a>
                                <?php if (isset($_SESSION['user_id'])): ?>
                                    <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="./logout.php">
                                        <i class="fas fa-sign-out-alt dropdown-icon"></i> Uitloggen
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Search Bar (Hidden by default) -->
        <div class="search-bar-container" id="searchBarContainer">
            <div class="container-fluid">
                <form class="search-form" action="./search.php" method="GET">
                    <i class="fas fa-search search-icon"></i>
                    <input type="search" class="search-input-full" placeholder="Zoek teams, wedstrijden, spelers..." name="q" id="mainSearchInput">
                    <button type="button" class="search-close" id="searchClose"><i class="fas fa-times"></i></button>
                </form>
            </div>
        </div>

        <!-- Secondary Navigation Bar -->
        <nav class="secondary-navbar">
            <div class="container-fluid">
                <div class="category-nav">
                    <a href="./index.php" class="category-link <?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? 'active' : ''; ?>">
                        <i class="fas fa-home category-icon"></i> HOME
                    </a>
                    <a href="./teams.php" class="category-link <?php echo basename($_SERVER['PHP_SELF']) == 'teams.php' ? 'active' : ''; ?>">
                        <i class="fas fa-users category-icon"></i> TEAMS
                    </a>
                    <a href="./matches.php" class="category-link <?php echo basename($_SERVER['PHP_SELF']) == 'matches.php' ? 'active' : ''; ?>">
                        <i class="fas fa-calendar-alt category-icon"></i> WEDSTRIJDEN
                    </a>
                    <a href="./wedstrijden.php" class="category-link <?php echo basename($_SERVER['PHP_SELF']) == 'wedstrijden.php' ? 'active' : ''; ?>">
                        <i class="fas fa-trophy category-icon"></i> UITSLAGEN
                    </a>
                </div>
            </div>
        </nav>
    </header>