<?php
// Panggil koneksi ke database
require_once 'conn.php'; // Pastikan file ini mengandung koneksi ke database
header("Access-Control-Allow-Origin: *"); // Memperbolehkan akses dari berbagai sumber
setlocale(LC_TIME, 'id_ID.utf8');
date_default_timezone_set('Asia/Jakarta');

$tanggal = date('d');
$bulan = date('m');
$tahun = date('Y');
$waktu = date('H:i:s');

// Tangkap data yang dikirim melalui parameter GET 
if (isset($_GET['ir']) && isset($_GET['bpm']) && isset($_GET['acelX']) && isset($_GET['acelY']) && isset($_GET['acelZ']) && isset($_GET['gyroX']) && isset($_GET['gyroY']) && isset($_GET['gyroZ']) && isset($_GET['magX']) && isset($_GET['magY']) && isset($_GET['magZ']) && isset($_GET['temp']) && isset($_GET['muscle']) && isset($_GET['_csrf_token'])) {
    // Verifikasi token CSRF
    if ($_GET['_csrf_token'] !== 'Z038OpTDXX') {
        die(json_encode(array('message' => 'Invalid CSRF token')));
    }

    $ir = $_GET['ir'];
    $bpm = $_GET['bpm'];
    $acelX = $_GET['acelX'];
    $acelY = $_GET['acelY'];
    $acelZ = $_GET['acelZ'];
    $gyroX = $_GET['gyroX'];
    $gyroY = $_GET['gyroY'];
    $gyroZ = $_GET['gyroZ'];
    $magX = $_GET['magX'];
    $magY = $_GET['magY'];
    $magZ = $_GET['magZ'];
    $temp = $_GET['temp'];
    $muscle = $_GET['muscle'];

    // Query untuk memasukkan data ke dalam tabel
    $sql = "INSERT INTO data (tanggal,bulan,tahun,waktu,ir,bpm,acelX,acelY,acelZ,gyroX,gyroY,gyroZ,magX,magY,magZ,temp,muscle) VALUES ('$tanggal','$bulan','$tahun','$waktu','$ir','$bpm','$acelX','$acelY','$acelZ','$gyroX','$gyroY','$gyroZ','$magX','$magY','$magZ','$temp','$muscle')";

    if (mysqli_query($conn, $sql)) {
        echo json_encode(array('message' => 'Data berhasil dimasukkan'));
    } else {
        echo json_encode(array('message' => 'Gagal memasukkan data: ' . mysqli_error($conn)));
    }
} else {
    echo json_encode(array('message' => 'Parameter tidak lengkap'));
}


//localhost/cuaca/api/data.php?ir=25.5&bpm=65&acelX=800&acelY=cerah&kelembapan_tanah=40&_csrf_token=Z038OpTDXX
