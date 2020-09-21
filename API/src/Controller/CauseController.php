<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Cause;
use App\Services\JwtAuth;

class CauseController extends AbstractController
{
    public function index()
    {
      $cause = $this->getDoctrine()->getRepository(Cause::class);
      $causes = $cause->findBy(array(
        'state' => 1
      ));

      return $this->json([
        'data' => $causes,
      ]);
    }

  public function all()
  {
    $cause = $this->getDoctrine()->getRepository(Cause::class);
    $causes = $cause->findAll();

    return $this->json([
      'data' => $causes,
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

          $cause = new cause();
          $cause->setName($name);
          $cause->setCreatedAt($date);
          $cause->setUpdatedAt($date);

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $cause_repo = $doctrine->getRepository(Cause::class);
          $isset_cause = $cause_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_cause) == 0) {

            $db->persist($cause);
            $db->flush();

            $causes = $cause_repo->findAll();

            $status = 'success';
            $code = 200;
            $mensaje = 'La causa se ha creado correctamente.';

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $causes
            ];

            return $this->json($data);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'La causa ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'La causa no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'La causa no se ha creado.';
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
        $cause_id = (!empty($json['id'])) ?  $json['id'] : null;

        if(!empty($name) && !empty($cause_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $cause_repo = $doctrine->getRepository(Cause::class);
          $cause = $cause_repo->findOneBy(array(
            'id' => $cause_id,
          ));

          $isset_cause = $cause_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_cause) == 0 || $cause->getName() == $name){

            $cause->setName($name);
            $cause->setUpdatedAt($date);

            $db->persist($cause);
            $db->flush();

            $causes = $cause_repo->findAll();

            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $causes
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Esta cause ya esta registrada.';
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

        $cause_id = (!empty($json['cause_id'])) ?  $json['cause_id'] : null;
        if(!empty($cause_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $cause_repo = $doctrine->getRepository(Cause::class);
          $cause = $cause_repo->findOneBy(array(
            'id' => $cause_id,
          ));

          $cause->setState('0');
          $cause->setUpdatedAt($date);

          $db->persist($cause);
          $db->flush();

          $causes = $cause_repo->findAll();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $causes
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

        $cause_id = (!empty($json['cause_id'])) ?  $json['cause_id'] : null;
        if(!empty($cause_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $cause_repo = $doctrine->getRepository(Cause::class);
          $cause = $cause_repo->findOneBy(array(
            'id' => $cause_id,
          ));

          $cause->setState('1');
          $cause->setUpdatedAt($date);

          $db->persist($cause);
          $db->flush();

          $causes = $cause_repo->findAll();

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $causes
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
    $json = $request->getContent();
    $json = json_decode($json, true);
    $token = $request->headers->get('authorization');
    $authCheck = $jwt_auth->checkToken($token);
    if ($authCheck) {
      if($json != null){

        $cause_id = (!empty($json['cause_id'])) ?  $json['cause_id'] : null;
        if(!empty($cause_id)) {

          $doctrine = $this->getDoctrine();
          $cause_repo = $doctrine->getRepository(Cause::class);
          $cause = $cause_repo->findOneBy(array(
            'id' => $cause_id,
          ));

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos a modificar.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $cause
          ];

          return $this->json($data);

        }else{
          $status = 'error';
          $code = 200;
          $mensaje = 'Todos los campos son obligatorios.';
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
