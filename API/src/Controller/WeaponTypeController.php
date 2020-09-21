<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\WeaponType;
use App\Services\JwtAuth;

class WeaponTypeController extends AbstractController
{
    public function index()
    {
      $weaponType = $this->getDoctrine()->getRepository(WeaponType::class);
      $weaponTypes = $weaponType->findBy(array(
        'state' => 1
      ));

      return $this->json([
        'data' => $weaponTypes,
      ]);
    }

    public function all()
    {
      $weaponType = $this->getDoctrine()->getRepository(WeaponType::class);
      $weaponTypes = $weaponType->findAll();

      return $this->json([
        'data' => $weaponTypes,
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

          $weaponType = new WeaponType();
          $weaponType->setName($name);
          $weaponType->setCreatedAt($date);
          $weaponType->setUpdatedAt($date);

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $weaponType_repo = $doctrine->getRepository(WeaponType::class);
          $isset_weaponType = $weaponType_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_weaponType) == 0) {

            $db->persist($weaponType);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'El tipo de arma se ha creado correctamente.';

            $weaponTypes = $weaponType_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $weaponTypes
            ];

            return $this->json($data);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'El tipo de arma ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'El tipo de arma no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'El tipo de arma no se ha creado.';
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
        $weaponType_id = (!empty($json['id'])) ?  $json['id'] : null;

        if(!empty($name) && !empty($weaponType_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $weaponType_repo = $doctrine->getRepository(WeaponType::class);
          $weaponType = $weaponType_repo->findOneBy(array(
            'id' => $weaponType_id,
          ));

          $isset_weaponType = $weaponType_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_weaponType) == 0 || $weaponType->getName() == $name){

            $weaponType->setName($name);
            $weaponType->setUpdatedAt($date);

            $db->persist($weaponType);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $weaponTypes = $weaponType_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $weaponTypes
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Este tipo de arma ya esta registrado.';
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

        $weaponType_id = (!empty($json['weapon_type_id'])) ?  $json['weapon_type_id'] : null;
        if(!empty($weaponType_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $weaponType_repo = $doctrine->getRepository(WeaponType::class);
          $weaponType = $weaponType_repo->findOneBy(array(
            'id' => $weaponType_id,
          ));
          $weaponType->setState(0);
          $weaponType->setUpdatedAt($date);

          $db->persist($weaponType);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $weaponTypes = $weaponType_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $weaponTypes
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

        $weaponType_id = (!empty($json['weapon_type_id'])) ?  $json['weapon_type_id'] : null;
        if(!empty($weaponType_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $weaponType_repo = $doctrine->getRepository(WeaponType::class);
          $weaponType = $weaponType_repo->findOneBy(array(
            'id' => $weaponType_id,
          ));
          $weaponType->setState(1);
          $weaponType->setUpdatedAt($date);

          $db->persist($weaponType);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $weaponTypes = $weaponType_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $weaponTypes
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

        $weaponType_id = (!empty($json['weapon_type_id'])) ?  $json['weapon_type_id'] : null;
        if(!empty($weaponType_id)) {

          $doctrine = $this->getDoctrine();
          $weaponType_repo = $doctrine->getRepository(WeaponType::class);
          $weaponType = $weaponType_repo->findOneBy(array(
            'id' => $weaponType_id,
          ));

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos cargados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $weaponType
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
}
