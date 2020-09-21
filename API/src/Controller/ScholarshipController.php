<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Scholarship;
use App\Services\JwtAuth;

class ScholarshipController extends AbstractController
{
    public function index()
    {
      $scholarship = $this->getDoctrine()->getRepository(Scholarship::class);
      $scholarships = $scholarship->findBy(array(
        'state' => 1
      ));

      return $this->json([
        'data' => $scholarships,
      ]);
    }

    public function all()
    {
      $scholarship = $this->getDoctrine()->getRepository(Scholarship::class);
      $scholarships = $scholarship->findAll();

      return $this->json([
        'data' => $scholarships,
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

          $scholarship = new Scholarship();
          $scholarship->setName($name);
          $scholarship->setCreatedAt($date);
          $scholarship->setUpdatedAt($date);

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $scholarship_repo = $doctrine->getRepository(Scholarship::class);
          $isset_scholarship = $scholarship_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_scholarship) == 0) {

            $db->persist($scholarship);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'La escolaridad se ha creado correctamente.';

            $scholarships = $scholarship_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $scholarships
            ];

            return $this->json($data);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'La escolaridad ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'La escolaridad no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'La escolaridad no se ha creado.';
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
        $scholarship_id = (!empty($json['id'])) ?  $json['id'] : null;

        if(!empty($name) && !empty($scholarship_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $scholarship_repo = $doctrine->getRepository(Scholarship::class);
          $scholarship = $scholarship_repo->findOneBy(array(
            'id' => $scholarship_id,
          ));

          $isset_scholarship = $scholarship_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_scholarship) == 0 || $scholarship->getName() == $name){

            $scholarship->setName($name);
            $scholarship->setUpdatedAt($date);

            $db->persist($scholarship);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $scholarships = $scholarship_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $scholarships
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Esta escolaridad ya esta registrada.';
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

        $scholarship_id = (!empty($json['scholarship_id'])) ?  $json['scholarship_id'] : null;
        if(!empty($scholarship_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $scholarship_repo = $doctrine->getRepository(Scholarship::class);
          $scholarship = $scholarship_repo->findOneBy(array(
            'id' => $scholarship_id,
          ));
          $scholarship->setState(0);
          $scholarship->setUpdatedAt($date);

          $db->persist($scholarship);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $scholarships = $scholarship_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $scholarships
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

        $scholarship_id = (!empty($json['scholarship_id'])) ?  $json['scholarship_id'] : null;
        if(!empty($scholarship_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $scholarship_repo = $doctrine->getRepository(Scholarship::class);
          $scholarship = $scholarship_repo->findOneBy(array(
            'id' => $scholarship_id,
          ));
          $scholarship->setState(1);
          $scholarship->setUpdatedAt($date);

          $db->persist($scholarship);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $scholarships = $scholarship_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $scholarships
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

        $scholarship_id = (!empty($json['scholarship_id'])) ?  $json['scholarship_id'] : null;
        if(!empty($scholarship_id)) {

          $doctrine = $this->getDoctrine();
          $scholarship_repo = $doctrine->getRepository(Scholarship::class);
          $scholarship = $scholarship_repo->findOneBy(array(
            'id' => $scholarship_id,
          ));

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos cargados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $scholarship
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
