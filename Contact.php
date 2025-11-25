<?php 
require_once 'includes/init.php';
require_once 'includes/header.php'; 
?>

<main>
    <div class="page-header">
        <div class="container">
            <h1><i class="fas fa-envelope"></i> Contact</h1>
            <p>Neem contact met ons op voor vragen of ondersteuning</p>
        </div>
    </div>

    <div class="container mt-5 mb-5">
        <div class="row">
            <div class="col-md-8 mb-4">
                <div class="contact-form-card">
                    <h2><i class="fas fa-paper-plane"></i> Stuur een Bericht</h2>
                    <form action="./process-contact.php" method="POST" class="contact-form">
                        <div class="form-group">
                            <label for="name"><i class="fas fa-user"></i> Naam</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email"><i class="fas fa-envelope"></i> Email</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="subject"><i class="fas fa-tag"></i> Onderwerp</label>
                            <input type="text" class="form-control" id="subject" name="subject" required>
                        </div>
                        <div class="form-group">
                            <label for="message"><i class="fas fa-comment"></i> Bericht</label>
                            <textarea class="form-control" id="message" name="message" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-lg btn-block">
                            <i class="fas fa-paper-plane"></i> Verstuur Bericht
                        </button>
                    </form>
                </div>
            </div>
            <div class="col-md-4">
                <div class="contact-info-card">
                    <h2><i class="fas fa-info-circle"></i> Contact Info</h2>
                    <div class="contact-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <h4>Adres</h4>
                            <p>Sportlaan 123<br>1234 AB Amsterdam</p>
                        </div>
                    </div>
                    <div class="contact-info-item">
                        <i class="fas fa-phone"></i>
                        <div>
                            <h4>Telefoon</h4>
                            <p>+31 20 123 4567</p>
                        </div>
                    </div>
                    <div class="contact-info-item">
                        <i class="fas fa-envelope"></i>
                        <div>
                            <h4>Email</h4>
                            <p>info@voetbaltoernooi.nl</p>
                        </div>
                    </div>
                    <div class="contact-info-item">
                        <i class="fas fa-clock"></i>
                        <div>
                            <h4>Openingstijden</h4>
                            <p>Ma-Vr: 09:00 - 17:00<br>Za-Zo: Gesloten</p>
                        </div>
                    </div>
                </div>
                <div class="social-links-card">
                    <h3>Volg Ons</h3>
                    <div class="social-links">
                        <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php require_once 'includes/footer.php'; ?>