<?php
require_once 'conn.php';
header("Access-Control-Allow-Origin: *");

$sql = "SELECT acelX,acelY,acelZ,gyroX,gyroY,gyroZ,magX,magY,magZ FROM data ORDER BY id DESC LIMIT 1";
$result = mysqli_query($conn, $sql);

$data = array();
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }
    // Mengonversi ke JSON dan menampilkan output
    echo json_encode($data);
} else {
    echo "Tidak ada data yang ditemukan.";
}
