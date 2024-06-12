<?php
require_once 'conn.php';
header("Access-Control-Allow-Origin: *");

$sql = "SELECT waktu,ir,bpm,acelX,acelY,acelZ,gyroX,gyroY,gyroZ,magX,magY,magZ,temp,muscle FROM data ORDER BY id DESC LIMIT 10";
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



// $data = array([
//     "x" => "2",
//     "y" => "2.100",
//     "z" => "0"
// ]);

// if ($result->num_rows > 0) {
//     // Menyimpan data dalam array
//     while ($row = $result->fetch_assoc()) {
//         $data[] = $row;
//     }
// } else {
//     echo "0 results";
// }

$conn->close();
