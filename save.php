<?php
if(!empty($_POST['data'])){
$data = $_POST['data'];
$fname = mktime() . ".txt";//generates random name

$file = fopen("saved/" .$fname, 'w');//creates new file
fwrite($file, $data);
fclose($file);
}

?>;