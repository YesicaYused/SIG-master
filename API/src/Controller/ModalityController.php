<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Modality;
use App\Services\JwtAuth;

class ModalityController extends AbstractController
{
    public function index()
    {
      $modality = $this->getDoctrine()->getRepository(Modality::class);
      $modalitys = $modality->findBy(array(
        'state' => 1
      ));

      return $this->json([
        'data' => $modalitys,
      ]);
    }

    public function all()
    {
      $modality = $this->getDoctrine()->getRepository(Modality::class);
      $modalitys = $modality->findAll();

      return $this->json([
        'data' => $modalitys,
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

          $modality = new Modality();
          $modality->setName($name);
          $modality->setCreatedAt($date);
          $modality->setUpdatedAt($date);

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $modality_repo = $doctrine->getRepository(Modality::class);
          $isset_modality = $modality_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_modality) == 0) {

            $db->persist($modality);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'La modalidad se ha creado correctamente.';

            $modalitys = $modality_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $modalitys
            ];

            return $this->json($data);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'La modalidad ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'La modalidad no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'La modalidad no se ha creado.';
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
        $modality_id = (!empty($json['id'])) ?  $json['id'] : null;

        if(!empty($name) && !empty($modality_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $modality_repo = $doctrine->getRepository(Modality::class);
          $modality = $modality_repo->findOneBy(array(
            'id' => $modality_id,
          ));

          $isset_modality = $modality_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_modality) == 0 || $modality->getName() == $name){

            $modality->setName($name);
            $modality->setUpdatedAt($date);

            $db->persist($modality);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $modalitys = $modality_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $modalitys
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Esta modalidad ya esta registrada.';
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

        $modality_id = (!empty($json['modality_id'])) ?  $json['modality_id'] : null;

        if(!empty($modality_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $modality_repo = $doctrine->getRepository(Modality::class);
          $modality = $modality_repo->findOneBy(array(
            'id' => $modality_id,
          ));

          $modality->setState(0);
          $modality->setUpdatedAt($date);

          $db->persist($modality);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $modalitys = $modality_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $modalitys
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

        $modality_id = (!empty($json['modality_id'])) ?  $json['modality_id'] : null;

        if(!empty($modality_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $modality_repo = $doctrine->getRepository(Modality::class);
          $modality = $modality_repo->findOneBy(array(
            'id' => $modality_id,
          ));

          $modality->setState(1);
          $modality->setUpdatedAt($date);

          $db->persist($modality);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $modalitys = $modality_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $modalitys
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

        $modality_id = (!empty($json['modality_id'])) ?  $json['modality_id'] : null;

        if(!empty($modality_id)) {

          $doctrine = $this->getDoctrine();
          $modality_repo = $doctrine->getRepository(Modality::class);
          $modality = $modality_repo->findOneBy(array(
            'id' => $modality_id,
          ));

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos cargados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $modality
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
