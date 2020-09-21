<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Profile;
use App\Services\JwtAuth;

class ProfileController extends AbstractController
{
    public function index()
    {
      $profile = $this->getDoctrine()->getRepository(Profile::class);
      $profiles = $profile->findBy(array(
        'state' => 1
      ));

      return $this->json([
        'data' => $profiles,
      ]);
    }

    public function all()
    {
      $profile = $this->getDoctrine()->getRepository(Profile::class);
      $profiles = $profile->findAll();

      return $this->json([
        'data' => $profiles,
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

        $name = $json['name'];
        if (!empty($name)) {

          $profile = new Profile();
          $profile->setName($name);
          $profile->setCreatedAt($date);
          $profile->setUpdatedAt($date);

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $profile_repo = $doctrine->getRepository(Profile::class);
          $isset_profile = $profile_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_profile) == 0) {

            $db->persist($profile);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'El perfil se ha creado correctamente.';

            $profiles = $profile_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $profiles
            ];

            return $this->json($data);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'El perfil ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'El perfil no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'El perfil no se ha creado.';
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

  public function update(Request $request, JwtAuth $jwt_auth)
  {
    $timezone = new \DateTimeZone('America/Bogota');
    $date = new \DateTime('now', $timezone);
    $json = $request->getContent();
    $json = json_decode($json, true);
    $token = $request->headers->get('authorization');
    $authCheck = $jwt_auth->checkToken($token);
    if ($authCheck){
      if($json != null){

        $name = (!empty($json['name'])) ?  $json['name'] : null;
        $profile_id = (!empty($json['id'])) ?  $json['id'] : null;

        if(!empty($name) && !empty($profile_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $profile_repo = $doctrine->getRepository(Profile::class);
          $profile = $profile_repo->findOneBy(array(
            'id' => $profile_id,
          ));

          $isset_profile = $profile_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_profile) == 0 || $profile->getName() == $name){

            $profile->setName($name);
            $profile->setUpdatedAt($date);

            $db->persist($profile);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $profiles = $profile_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $profiles
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Este perfil ya esta registrado.';
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

        $profile_id = (!empty($json['profile_id'])) ?  $json['profile_id'] : null;
        if(!empty($profile_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $profile_repo = $doctrine->getRepository(Profile::class);
          $profile = $profile_repo->findOneBy(array(
            'id' => $profile_id,
          ));
          $profile->setState(0);
          $profile->setUpdatedAt($date);

          $db->persist($profile);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $profiles = $profile_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $profiles
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

        $profile_id = (!empty($json['profile_id'])) ?  $json['profile_id'] : null;
        if(!empty($profile_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $profile_repo = $doctrine->getRepository(Profile::class);
          $profile = $profile_repo->findOneBy(array(
            'id' => $profile_id,
          ));
          $profile->setState(1);
          $profile->setUpdatedAt($date);

          $db->persist($profile);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $profiles = $profile_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $profiles
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

        $profile_id = (!empty($json['profile_id'])) ?  $json['profile_id'] : null;
        if(!empty($profile_id)) {

          $doctrine = $this->getDoctrine();
          $profile_repo = $doctrine->getRepository(Profile::class);
          $profile = $profile_repo->findOneBy(array(
            'id' => $profile_id,
          ));

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos cargados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $profile
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

  public function getModuleProfile(Request $request, JwtAuth $jwt_auth)
  {
    $json = $request->getContent();
    $json = json_decode($json, true);
    $token = $request->headers->get('authorization');
    $authCheck = $jwt_auth->checkToken($token);
    if ($authCheck) {
      if($json != null){

        $name = (!empty($json['name'])) ?  $json['name'] : null;
        $code = (!empty($json['code'])) ?  $json['code'] : null;
        if(!empty($name)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getConnection();

          $queryValidation = "SELECT pr.id AS profile_id, p.id AS person_id FROM person p
                    INNER JOIN person_profile pp
                    ON p.id = pp.person_id
                    INNER JOIN profile pr
                    ON pr.id = pp.profile_id
                    WHERE p.code = $code AND pr.name = '$name' AND pp.state=1";

          $stmtValidation = $db->prepare($queryValidation);
          $paramsValidation = array();
          $stmtValidation->execute($paramsValidation);
          $validation = $stmtValidation->fetchAll();

          if($validation[0]['profile_id'] && $validation[0]['person_id']) {

            $profile_id = $validation[0]['profile_id'];
            $query = "SELECT m.name, m.route FROM module m
                    INNER JOIN module_profile mp
                    ON m.id = mp.module_id
                    INNER JOIN profile p
                    ON p.id = mp.profile_id
                    WHERE p.id = $profile_id AND mp.state=1";

            $stmt = $db->prepare($query);
            $params = array();
            $stmt->execute($params);
            $result = $stmt->fetchAll();

            $array = [
              'status' => 'success',
              'message' => 'Información cargada exitosamente.',
              'modules' => $result
            ];
            return $this->json($array);
          }else{
            $status = 'error';
            $code = 400;
            $mensaje = 'El perfil seleccionado no existe o no esta asignado para su cuenta.';
          }
        }else{
          $status = 'error';
          $code = 400;
          $mensaje = 'No se ha seleccionado un perfil.';
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

    return $this->json($data);
  }

  public function getPermisionProfile(Request $request, JwtAuth $jwt_auth)
  {
    $json = $request->getContent();
    $json = json_decode($json, true);
    $token = $request->headers->get('authorization');
    $authCheck = $jwt_auth->checkToken($token);
    if ($authCheck) {
      if($json != null){

        $name = (!empty($json['name'])) ?  $json['name'] : null;
        $code = (!empty($json['code'])) ?  $json['code'] : null;
        if(!empty($name)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getConnection();

          $query = "SELECT pr.id AS profile_id, p.id AS person_id FROM person p
                    INNER JOIN person_profile pp
                    ON p.id = pp.person_id
                    INNER JOIN profile pr
                    ON pr.id = pp.profile_id
                    WHERE p.code = $code AND pr.name = '$name' AND pp.state=1";

          $stmt = $db->prepare($query);
          $params = array();
          $stmt->execute($params);
          $validation = $stmt->fetchAll();

          if($validation['profile_id'] && $validation['person_id']) {

            $profile_id = $validation['profile_id'];
            $query2 = "SELECT p.*, i.name AS icon, it.name AS icon_type, ith.name AS icon_theme FROM permission p
                    INNER JOIN permission_profile pp
                    ON p.id = pp.permission_id
                    INNER JOIN profile pr
                    ON pr.id = pp.profile_id
                    INNER JOIN icon i
                    ON p.icon_id = i.id
                    INNER JOIN icon_type it
                    ON i.icon_type_id = it.id
                    INNER JOIN icon_theme ith
                    ON i.icon_theme_id = ith.id
                    WHERE pr.id = $profile_id AND pp.state=1";

            $stmt2 = $db->prepare($query2);
            $params2 = array();
            $stmt2->execute($params2);
            $result = $stmt2->fetchAll();

            $array = [
              'status' => 'success',
              'message' => '',
              'permission' => $result
            ];
            return $this->json($array);
          }else{
            $status = 'error';
            $code = 400;
            $mensaje = 'El perfil seleccionado no existe o no esta asignado para su cuenta.';
          }
        }else{
          $status = 'error';
          $code = 400;
          $mensaje = 'No se ha seleccionado un perfil.';
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

    return $this->json($data);
  }
}
