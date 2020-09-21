<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Vehicle;
use App\Services\JwtAuth;

class VehicleController extends AbstractController
{
    public function index()
    {
      $vehicle = $this->getDoctrine()->getRepository(Vehicle::class);
      $vehicles = $vehicle->findBy(array(
        'state' => 1
      ));

      return $this->json([
        'data' => $vehicles,
      ]);
    }

    public function all()
    {
      $vehicle = $this->getDoctrine()->getRepository(Vehicle::class);
      $vehicles = $vehicle->findAll();

      return $this->json([
        'data' => $vehicles,
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

          $vehicle = new Vehicle();
          $vehicle->setName($name);
          $vehicle->setCreatedAt($date);
          $vehicle->setUpdatedAt($date);

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $vehicle_repo = $doctrine->getRepository(Vehicle::class);
          $isset_vehicle = $vehicle_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_vehicle) == 0) {

            $db->persist($vehicle);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'El vehiculo se ha creado correctamente.';

            $vehicles = $vehicle_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $vehicles
            ];

            return $this->json($data);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'El vehiculo ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'El vehiculo no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'El vehiculo no se ha creado.';
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
        $vehicle_id = (!empty($json['id'])) ?  $json['id'] : null;

        if(!empty($name) && !empty($vehicle_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $vehicle_repo = $doctrine->getRepository(Vehicle::class);
          $vehicle = $vehicle_repo->findOneBy(array(
            'id' => $vehicle_id,
          ));

          $isset_vehicle = $vehicle_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_vehicle) == 0 || $vehicle->getName() == $name){

            $vehicle->setName($name);
            $vehicle->setUpdatedAt($date);

            $db->persist($vehicle);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $vehicles = $vehicle_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $vehicles
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Este vehiculo ya esta registrado.';
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

        $vehicle_id = (!empty($json['vehicle_id'])) ?  $json['vehicle_id'] : null;
        if(!empty($vehicle_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $vehicle_repo = $doctrine->getRepository(Vehicle::class);
          $vehicle = $vehicle_repo->findOneBy(array(
            'id' => $vehicle_id,
          ));
          $vehicle->setState(0);
          $vehicle->setUpdatedAt($date);

          $db->persist($vehicle);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $vehicles = $vehicle_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $vehicles
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

        $vehicle_id = (!empty($json['vehicle_id'])) ?  $json['vehicle_id'] : null;
        if(!empty($vehicle_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $vehicle_repo = $doctrine->getRepository(Vehicle::class);
          $vehicle = $vehicle_repo->findOneBy(array(
            'id' => $vehicle_id,
          ));
          $vehicle->setState(1);
          $vehicle->setUpdatedAt($date);

          $db->persist($vehicle);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $vehicles = $vehicle_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $vehicles
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

        $vehicle_id = (!empty($json['vehicle_id'])) ?  $json['vehicle_id'] : null;
        if(!empty($vehicle_id)) {

          $doctrine = $this->getDoctrine();
          $vehicle_repo = $doctrine->getRepository(Vehicle::class);
          $vehicle = $vehicle_repo->findOneBy(array(
            'id' => $vehicle_id,
          ));

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos cargados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $vehicle
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
