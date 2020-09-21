<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Zone;
use App\Services\JwtAuth;

class ZoneController extends AbstractController
{
    public function index()
    {
      $zone = $this->getDoctrine()->getRepository(Zone::class);
      $zones = $zone->findBy(array(
        'state' => 1
      ));

      return $this->json([
        'data' => $zones,
      ]);
    }

    public function all()
    {
      $zone = $this->getDoctrine()->getRepository(Zone::class);
      $zones = $zone->findAll();

      return $this->json([
        'data' => $zones,
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

          $zone = new Zone();
          $zone->setName($name);
          $zone->setCreatedAt($date);
          $zone->setUpdatedAt($date);

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $zone_repo = $doctrine->getRepository(Zone::class);
          $isset_zone = $zone_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_zone) == 0) {

            $db->persist($zone);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'La zona se ha creado correctamente.';

            $zones = $zone_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $zones
            ];

            return $this->json($data);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'La zona ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'La zona no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'La zona no se ha creado.';
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
        $zone_id = (!empty($json['id'])) ?  $json['id'] : null;

        if(!empty($name) && !empty($zone_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $zone_repo = $doctrine->getRepository(Zone::class);
          $zone = $zone_repo->findOneBy(array(
            'id' => $zone_id,
          ));

          $isset_zone = $zone_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_zone) == 0 || $zone->getName() == $name){

            $zone->setName($name);
            $zone->setUpdatedAt($date);

            $db->persist($zone);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $zones = $zone_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $zones
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Esta zona ya esta registrada.';
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

        $zone_id = (!empty($json['zone_id'])) ?  $json['zone_id'] : null;
        if(!empty($zone_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $zone_repo = $doctrine->getRepository(Zone::class);
          $zone = $zone_repo->findOneBy(array(
            'id' => $zone_id,
          ));
          $zone->setState(0);
          $zone->setUpdatedAt($date);

          $db->persist($zone);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $zones = $zone_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $zones
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

        $zone_id = (!empty($json['zone_id'])) ?  $json['zone_id'] : null;
        if(!empty($zone_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $zone_repo = $doctrine->getRepository(Zone::class);
          $zone = $zone_repo->findOneBy(array(
            'id' => $zone_id,
          ));
          $zone->setState(1);
          $zone->setUpdatedAt($date);

          $db->persist($zone);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $zones = $zone_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $zones
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

        $zone_id = (!empty($json['zone_id'])) ?  $json['zone_id'] : null;
        if(!empty($zone_id)) {

          $doctrine = $this->getDoctrine();
          $zone_repo = $doctrine->getRepository(Zone::class);
          $zone = $zone_repo->findOneBy(array(
            'id' => $zone_id,
          ));
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos cargados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $zone
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
