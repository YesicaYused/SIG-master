<?php
namespace App\Services;

use Firebase\JWT\JWT;
use App\Entity\Person;

class JwtAuth{

  public $manager;
  public $key;

  public function __construct($manager)
  {
    $this->manager = $manager;
    $this->key = 'PvdLabs2020+';
  }

  public function signup($code, $password, $getToken = null)
  {

    $signup = false;
    $data = $this->manager->getRepository(Person::class)->findOneBy([
      'code' => $code,
    ]);

    if(is_object($data)){

      $signup = true;
    }

    if($signup){
      if(password_verify($password, $data->getPassword())){
        if(!empty($getToken)){
          $token = [
            'sub' => $data->getId(),
            'name' => $data->getName(),
            'code' => $data->getCode(),
            'last_name' => $data->getLastName(),
            'observatory' => $data->getObservatory()->getName(),
            'iat' => time(),
            'exp' => time() + (7*24*60*60),
          ];

          $jwt = JWT::encode($token, $this->key, 'HS256');

          $data = [
            'status' => 'success',
            'message' => 'Datos correctos, en un momento lo redirigiremos.',
            'data' => $jwt
          ];
        }else{
          $token = [
            'name' => $data->getName(),
            'code' => $data->getCode(),
            'last_name' => $data->getLastName(),
            'observatory' => $data->getObservatory()->getName(),
          ];

          $doctrine = $this->manager;
          $db = $doctrine->getConnection();
          $query = "SELECT pr.name FROM person p
                    INNER JOIN person_profile pp
                    ON p.id = pp.person_id
                    INNER JOIN profile pr
                    ON pr.id = pp.profile_id
                    WHERE p.code = $code AND pr.state=1";

          $stmt = $db->prepare($query);
          $params = array();
          $stmt->execute($params);
          $result = $stmt->fetchAll();

//          $decoded = JWT::decode($jwt, $this->key, ['HS256']);
          $data = [
            'status' => 'success',
            'message' => 'Datos correctos, en un momento lo redirigiremos.',
            'data' => $token,
            'profile' => $result
          ];
        }
      }else{
        $data = [
          'status' => 'error',
          'message' => 'Usuario o contraseña incorrectos, verifique su información.',
        ];
      }
    }else{
      $data = [
        'status' => 'error',
        'message' => 'Usuario o contraseña incorrectos, verifique su información.',
      ];
    }
    return $data;
  }

  public function checkToken($jwt, $identity = false)
  {
    $auth = false;
    try {
      $decode = JWT::decode($jwt, $this->key, ['HS256']);
    }catch (\UnexpectedValueException $e) {
      $auth = false;
    }catch (\DomainException $e) {
      $auth = false;
    }

    if(isset($decode) && !empty($decode) && is_object($decode) && isset($decode->sub)){
      $auth = true;
    }else{
      $auth = false;
    }

    if($identity){
      $auth = $decode;
    }

    return $auth;
  }
}
