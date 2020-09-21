<?php

namespace App\Controller;

use App\Entity\Observatory;
use App\Entity\Person;
use Firebase\JWT\JWT;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Services\JwtAuth;

class PersonController extends AbstractController
{
    public function index()
    {
      $person = $this->getDoctrine()->getRepository(Person::class);
      $people = $person->findBy(array(
        'state' => 1
      ));

      return $this->json([
        'data' => $people,
      ]);
    }

    public function all()
    {
      $person = $this->getDoctrine()->getRepository(Person::class);
      $people = $person->findAll();

      return $this->json([
        'data' => $people,
      ]);
    }

  public function create(Request $request, JwtAuth $jwt_auth)
  {

    $timezone = new \DateTimeZone('America/Bogota');
    $date = new \DateTime('now', $timezone);
    $json = $request->getContent();
    $json = json_decode($json, true);
    $token = $request->headers->get('authorization');
    $authCheck = $jwt_auth->checkToken($token);

    if ($authCheck) {
      if ($json != null) {

        $name = (!empty($json['name'])) ? $json['name'] : null;
        $last_name = (!empty($json['last_name'])) ? $json['last_name'] : null;
        $code_p = (!empty($json['code'])) ? $json['code'] : null;
        $password = (!empty($json['password'])) ? $json['password'] : null;
        $observatory_id = (!empty($json['observatory_name'])) ? $json['observatory_name'] : null;

        if (!empty($name) && !empty($last_name) && !empty($code_p) && !empty($password) && !empty($observatory_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();

          $observatory_repo = $doctrine->getRepository(Observatory::class);
          $observatory = $observatory_repo->findOneBy(array(
            'name' => $observatory_id
          ));

          $person = new Person();
          $person->setName($name);
          $person->setLastName($last_name);
          $person->setCode($code_p);
          $person->setPassword(password_hash($password, PASSWORD_DEFAULT));
          $person->setObservatory($observatory);
          $person->setCreatedAt($date);
          $person->setUpdatedAt($date);


          $person_repo = $doctrine->getRepository(Person::class);
          $isset_person = $person_repo->findBy(array(
            'code' => $code_p
          ));

          if (count($isset_person) == 0) {

            $db->persist($person);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'El usuario se ha creado correctamente.';

            $people = $person_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $people
            ];

            return $this->json($data);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'El codigo ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'Todos los campos son obligatorios.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'El usuario no se ha creado.';
      }
    }else{
      $status = 'error';
      $code = 400;
      $mensaje = 'No tiene permisos para realizar esa operación.';
    }

    $data = [
      'status' => $status,
      'code' => $code,
      'message' => $mensaje,
    ];

    return $this->json($data);
  }

  public function updatePersonalInformation(Request $request, JwtAuth $jwt_auth)
  {
    $timezone = new \DateTimeZone('America/Bogota');
    $date = new \DateTime('now', $timezone);
    $json = $request->getContent();
    $json = json_decode($json, true);
    $token = $request->headers->get('authorization');
    $authCheck = $jwt_auth->checkToken($token);

    if($json != null){

      $name = (!empty($json['name'])) ?  $json['name'] : null;
      $last_name = (!empty($json['last_name'])) ?  $json['last_name'] : null;
      $code_p = (!empty($json['code'])) ?  $json['code'] : null;
      $observatory_id = (!empty($json['observatory_name'])) ?  $json['observatory_name'] : null;

      if(!empty($name) && !empty($last_name) && !empty($code_p) && !empty($observatory_id)) {
        if ($authCheck) {
          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $identity = $jwt_auth->checkToken($token, true);

          $person_repo = $doctrine->getRepository(Person::class);
          $person = $person_repo->findOneBy(array(
            'id' => $identity->sub,
          ));

          $observatory_repo = $doctrine->getRepository(Observatory::class);
          $observatory = $observatory_repo->findOneBy(array(
            'name' => $observatory_id
          ));

          $person->setName($name);
          $person->setLastName($last_name);
          $person->setCode($code_p);
          $person->setObservatory($observatory);
          $person->setUpdatedAt($date);

          $isset_person = $person_repo->findBy(array(
            'code' => $code_p
          ));

          if(count($isset_person) == 0 || $identity->code == $code_p){
            $db->persist($person);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'El codigo ya esta en uso.';
          }
        }else{
          $status = 'error';
          $code = 400;
          $mensaje = 'No tiene permisos para realizar esa operación.';
        }
      }else{
        $status = 'error';
        $code = 200;
        $mensaje = 'Todos los campos son obligatorios.';
      }
    }else{
      $status = 'error';
      $code = 200;
      $mensaje = 'No se han modificados los datos, intentelo nuevamente.';
    }

    $data = [
      'status' => $status,
      'code' => $code,
      'message' => $mensaje,
    ];
    return $this->json($data);
  }

  public function update(Request $request, JwtAuth $jwt_auth)
  {
    $timezone = new \DateTimeZone('America/Bogota');
    $date = new \DateTime('now', $timezone);
    $json = $request->getContent();
    $json = json_decode($json, true);
    $token = $request->headers->get('authorization');
    $authCheck = $jwt_auth->checkToken($token);

    if ($authCheck) {
      if($json != null){

        $name = (!empty($json['name'])) ?  $json['name'] : null;
        $last_name = (!empty($json['lastName'])) ?  $json['lastName'] : null;
        $code_p = (!empty($json['code'])) ?  $json['code'] : null;
        $observatory_id = (!empty($json['observatory_name'])) ?  $json['observatory_name'] : null;
        $person_id = (!empty($json['id'])) ?  $json['id'] : null;

        if(!empty($name) && !empty($last_name) && !empty($code_p) && !empty($observatory_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $person_repo = $doctrine->getRepository(Person::class);
          $person = $person_repo->findOneBy(array(
            'id' => $person_id,
          ));

          $observatory_repo = $doctrine->getRepository(Observatory::class);
          $observatory = $observatory_repo->findOneBy(array(
            'name' => $observatory_id
          ));

          $isset_code = $person_repo->findBy(array(
            'code' => $code_p,
          ));

          if(count($isset_code) == 0 || $person->getCode() == $code_p){

            $person->setName($name);
            $person->setLastName($last_name);
            $person->setCode($code_p);
            $person->setObservatory($observatory);
            $person->setUpdatedAt($date);

            $db->persist($person);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $people = $person_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $people
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'El codigo ya esta en uso.';
          }
        }else{
          $status = 'error';
          $code = 200;
          $mensaje = 'Todos los campos son obligatorios.';
        }
      }else{
        $status = 'error';
        $code = 200;
        $mensaje = 'No se han modificados los datos, intentelo nuevamente.';
      }
    }else{
      $status = 'error';
      $code = 400;
      $mensaje = 'No tiene permisos para realizar esa operación.';
    }

    $data = [
      'status' => $status,
      'code' => $code,
      'message' => $mensaje,
    ];
    return $this->json($data);
  }

  public function delete(Request $request, JwtAuth $jwt_auth)
  {
    $timezone = new \DateTimeZone('America/Bogota');
    $date = new \DateTime('now', $timezone);
    $json = $request->getContent();
    $json = json_decode($json, true);
    $token = $request->headers->get('authorization');
    $authCheck = $jwt_auth->checkToken($token);
    if ($authCheck) {
      if($json != null){

        $person_id = (!empty($json['person_id'])) ?  $json['person_id'] : null;
        if(!empty($person_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $person_repo = $doctrine->getRepository(Person::class);
          $person = $person_repo->findOneBy(array(
            'id' => $person_id,
          ));
          $person->setState(0);
          $person->setUpdatedAt($date);

          $db->persist($person);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $people = $person_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $people
          ];

          return $this->json($data);
        }else{
          $status = 'error';
          $code = 200;
          $mensaje = 'Todos los campos son obligatorios.';
        }
      }else{
        $status = 'error';
        $code = 200;
        $mensaje = 'No se han modificados los datos, intentelo nuevamente.';
      }
    }else{
      $status = 'error';
      $code = 400;
      $mensaje = 'No tiene permisos para realizar esa operación.';
    }

    $data = [
      'status' => $status,
      'code' => $code,
      'message' => $mensaje,
    ];

    return $this->json($data);
  }

  public function restore(Request $request, JwtAuth $jwt_auth)
  {
    $timezone = new \DateTimeZone('America/Bogota');
    $date = new \DateTime('now', $timezone);
    $json = $request->getContent();
    $json = json_decode($json, true);
    $token = $request->headers->get('authorization');
    $authCheck = $jwt_auth->checkToken($token);
    if ($authCheck) {
      if($json != null){

        $person_id = (!empty($json['person_id'])) ?  $json['person_id'] : null;
        if(!empty($person_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $person_repo = $doctrine->getRepository(Person::class);
          $person = $person_repo->findOneBy(array(
            'id' => $person_id,
          ));
          $person->setState(1);
          $person->setUpdatedAt($date);

          $db->persist($person);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $people = $person_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $people
          ];

          return $this->json($data);
        }else{
          $status = 'error';
          $code = 200;
          $mensaje = 'Todos los campos son obligatorios.';
        }
      }else{
        $status = 'error';
        $code = 200;
        $mensaje = 'No se han modificados los datos, intentelo nuevamente.';
      }
    }else{
      $status = 'error';
      $code = 400;
      $mensaje = 'No tiene permisos para realizar esa operación.';
    }

    $data = [
      'status' => $status,
      'code' => $code,
      'message' => $mensaje,
    ];

    return $this->json($data);
  }

  public function query(Request $request, JwtAuth $jwt_auth)
  {
    $timezone = new \DateTimeZone('America/Bogota');
    $date = new \DateTime('now', $timezone);
    $json = $request->getContent();
    $json = json_decode($json, true);
    $token = $request->headers->get('authorization');
    $authCheck = $jwt_auth->checkToken($token);
    if ($authCheck) {
      if($json != null){

        $person_id = (!empty($json['person_id'])) ?  $json['person_id'] : null;
        if(!empty($person_id)) {

          $doctrine = $this->getDoctrine();
          $person_repo = $doctrine->getRepository(Person::class);
          $person = $person_repo->findOneBy(array(
            'id' => $person_id,
          ));

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos cargados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $person
          ];

          return $this->json($data);
        }else{
          $status = 'error';
          $code = 200;
          $mensaje = 'Todos los campos son obligatorios.';
        }
      }else{
        $status = 'error';
        $code = 200;
        $mensaje = 'No se han modificados los datos, intentelo nuevamente.';
      }
    }else{
      $status = 'error';
      $code = 400;
      $mensaje = 'No tiene permisos para realizar esa operación.';
    }

    $data = [
      'status' => $status,
      'code' => $code,
      'message' => $mensaje,
    ];

    return $this->json($data);
  }

  public function login(Request $request, JwtAuth $jwtAuth)
  {
    $json = $request->getContent();
    $json = json_decode($json, true);

    $code = (!empty($json['code'])) ?  $json['code'] : null;
    $password = (!empty($json['password'])) ?  $json['password'] : null;
    $getToken = (!empty($json['getToken'])) ?  $json['getToken'] : null;

    if($json != null){
      if(!empty($code) && !empty($password)){
        if($getToken){

          $signup = $jwtAuth->signup($code, $password, $getToken);
        }else{

          $signup = $jwtAuth->signup($code, $password);
        }

        return $this->json([
          'data' => $signup
        ]);
      }
    }else{
      $status = 'error';
      $code = 200;
      $mensaje = 'Todos los campos son obligatorios.';
    }

    $data = [
      'status' => $status,
      'code' => $code,
      'message' => $mensaje,
    ];

    return $this->json([
      'data' => $data,
    ]);
  }

  public function Personalinformation(Request $request, JwtAuth $jwt_auth)
  {
    $json = $request->getContent();
    $json = json_decode($json, true);
    $token = $request->headers->get('authorization');
    $authCheck = $jwt_auth->checkToken($token);
    if ($authCheck) {
      if($json != null){

        $code = (!empty($json['code'])) ?  $json['code'] : null;
        if(!empty($code)) {

          $doctrine = $this->getDoctrine();
          $data = $doctrine->getRepository(Person::class)->findOneBy([
            'code' => $code,
          ]);

          $token = [
            'name' => $data->getName(),
            'code' => $data->getCode(),
            'last_name' => $data->getLastName(),
            'observatory' => $data->getObservatory()->getName(),
          ];

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

          $array = [
            'status' => 'success',
            'message' => '',
            'data' => $token,
            'profile' => $result
          ];
          return $this->json($array);
        }else{
          $status = 'error';
          $code = 400;
          $mensaje = 'No has iniciado sesión.';
        }
      }
    }else{
      $status = 'error';
      $code = 400;
      $mensaje = 'No tiene permisos para realizar esa operación.';
    }
    $data = [
      'status' => $status,
      'code' => $code,
      'message' => $mensaje,
    ];

    return $this->json([
      'data' => $data,
    ]);
  }

  public function queryProfile(Request $request, JwtAuth $jwt_auth)
  {
    $json = $request->getContent();
    $json = json_decode($json, true);
    $token = $request->headers->get('authorization');
    $authCheck = $jwt_auth->checkToken($token);
    if ($authCheck) {
      if($json != null){

        $id = (!empty($json['id'])) ?  $json['id'] : null;
        if(!empty($id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getConnection();

          $query = "SELECT * FROM profile p
                    WHERE p.id NOT IN
                    (SELECT p.id FROM profile p
                    INNER JOIN person_profile pp
                    ON p.id = pp.profile_id
                    WHERE pp.person_id = $id)";

          $stmt = $db->prepare($query);
          $params = array();
          $stmt->execute($params);
          $result = $stmt->fetchAll();

          $array = [
            'status' => 'success',
            'message' => 'Perfiles disponibles',
            'profile' => $result,
          ];
          return $this->json($array);
        }else{
          $status = 'error';
          $code = 400;
          $mensaje = 'Todos los campos son requeridos.';
        }
      }
    }else{
      $status = 'error';
      $code = 400;
      $mensaje = 'No tiene permisos para realizar esa operación.';
    }
    $data = [
      'status' => $status,
      'code' => $code,
      'message' => $mensaje,
    ];

    return $this->json([
      'data' => $data,
    ]);
  }
}
