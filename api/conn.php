<?php
date_default_timezone_set('Asia/Jakarta');
$servername = "localhost";
$username = "root";
$password = "";
$database = "sportFlux";

// Membuat koneksi
$conn = mysqli_connect($servername, $username, $password, $database);

// Memeriksa koneksi
if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
}
