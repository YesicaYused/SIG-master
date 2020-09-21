<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Observatory;
use App\Services\JwtAuth;

class ObservatoryController extends AbstractController
{
    public function index()
    {
      $observatory = $this->getDoctrine()->getRepository(Observatory::class);
      $observatorys = $observatory->findBy(array(
        'state' => 1
      ));

      return $this->json([
        'data' => $observatorys,
      ]);
    }

    public function all()
    {
      $observatory = $this->getDoctrine()->getRepository(Observatory::class);
      $observatorys = $observatory->findAll();

      return $this->json([
        'data' => $observatorys,
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

          $observatory = new Observatory();
          $observatory->setName($name);
          $observatory->setCreatedAt($date);
          $observatory->setUpdatedAt($date);

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $observatory_repo = $doctrine->getRepository(Observatory::class);
          $isset_observatory = $observatory_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_observatory) == 0) {

            $db->persist($observatory);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'El observatorio se ha creado correctamente.';

            $observatorys = $observatory_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $observatorys
            ];

            return $this->json($data);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'El observatorio ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'El observatorio no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'El observatorio no se ha creado.';
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
        $observatory_id = (!empty($json['id'])) ?  $json['id'] : null;

        if(!empty($name) && !empty($observatory_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $observatory_repo = $doctrine->getRepository(Observatory::class);
          $observatory = $observatory_repo->findOneBy(array(
            'id' => $observatory_id,
          ));

          $isset_observatory = $observatory_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_observatory) == 0 || $observatory->getName() == $name){

            $observatory->setName($name);
            $observatory->setUpdatedAt($date);

            $db->persist($observatory);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $observatorys = $observatory_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $observatorys
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Este observatorio ya esta registrado.';
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

        $observatory_id = (!empty($json['observatory_id'])) ?  $json['observatory_id'] : null;
        if(!empty($observatory_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $observatory_repo = $doctrine->getRepository(Observatory::class);
          $observatory = $observatory_repo->findOneBy(array(
            'id' => $observatory_id,
          ));

          $observatory->setState(0);
          $observatory->setUpdatedAt($date);

          $db->persist($observatory);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $observatorys = $observatory_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $observatorys
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

        $observatory_id = (!empty($json['observatory_id'])) ?  $json['observatory_id'] : null;
        if(!empty($observatory_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $observatory_repo = $doctrine->getRepository(Observatory::class);
          $observatory = $observatory_repo->findOneBy(array(
            'id' => $observatory_id,
          ));

          $observatory->setState(0);
          $observatory->setUpdatedAt($date);

          $db->persist($observatory);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $observatorys = $observatory_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $observatorys
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

        $observatory_id = (!empty($json['observatory_id'])) ?  $json['observatory_id'] : null;
        if(!empty($observatory_id)) {

          $doctrine = $this->getDoctrine();
          $observatory_repo = $doctrine->getRepository(Observatory::class);
          $observatory = $observatory_repo->findOneBy(array(
            'id' => $observatory_id,
          ));

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos cargados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $observatory
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
