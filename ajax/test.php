<?php
   extract($GLOBALS);
   $pid=$_GET['pid'];
   echo 'Before Sleep:'.$pid;
   sleep(rand(0,10));
   echo 'After Sleep:'.$pid;
?>