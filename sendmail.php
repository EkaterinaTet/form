<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php'; //подключаем сами файлы из папки
require 'phpmailer/src/PHPMailer.php';

$mail = new PHPMailer(true); //его объявление
$mail->CharSet = 'UTF-8'; //настройка кодировки
$mail->setLanguage('ru', 'phpmailer/language/'); //подключаем языковой файл из той же папки
$mail->IsHTML(true); //возможность html тегов в письме

//От кого письмо
$mail->setFrom('from@example.com', 'Mailer');
//Кому отправить(можно указать один или несколько адресатов)
$mail->addAddress('ekaterina.psychologist98@gmail.com');
//Тема письма
$mail->Subject = 'Привет! Это Фрилансер!';

//Рука
$hand = "Правая"'
if($_POST['hand'] == "left") {
    $hand = "Левая";
}



$body = '<h1>Встречайте письма!</h1>';

if(trim(!empty($_POST['name']))){
    $body.='<p><strong>Имя:</strong> '.$_POST['name'].'</p>';
}
if(trim(!empty($_POST['email']))){
    $body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
}
if(trim(!empty($_POST['hand']))){
    $body.='<p><strong>Рука:</strong> '.$hand.'</p>';
}
if(trim(!empty($_POST['age']))){
    $body.='<p><strong>Возраст:</strong> '.$_POST['age'].'</p>';
}
if(trim(!empty($_POST['message']))){
    $body.='<p><strong>Сообщение:</strong> '.$_POST['message'].'</p>';
}



if(!empty($_FILES['image']['tmp_name'])){ 


    
$filePath = __DIR__ . "/files/" . $_FILES['image']['name'];



   if(copy($_FILES['image']['tmp_name'], $filePath)) {
    $fileAttach = $filePath;
    $body.='<p><strong>Фото в приложении</strong></p>';
    $mail->addAttachment($fileAttach);
   }
}

$mail->Body = $body;


if (!$mail->send()){     
    $message = 'Ошибка';
} else {
    $message = 'Данные отправлены!';
}
$response = ['message' => $message]; 
header('Content-type: application/json');
echo json_encode($response);
?>
