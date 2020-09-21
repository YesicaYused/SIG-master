<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Nationality;
use App\Services\JwtAuth;

class NationalityController extends AbstractController
{
    public function index()
    {
      $nationality = $this->getDoctrine()->getRepository(Nationality::class);
      $nationalitys = $nationality->findBy(array(
        'state' => 1
      ));

      return $this->json([
        'data' => $nationalitys,
      ]);
    }

    public function all()
    {
      $nationality = $this->getDoctrine()->getRepository(Nationality::class);
      $nationalitys = $nationality->findAll();

      return $this->json([
        'data' => $nationalitys,
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

          $nationality = new Nationality();
          $nationality->setName($name);
          $nationality->setCreatedAt($date);
          $nationality->setUpdatedAt($date);

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $nationality_repo = $doctrine->getRepository(Nationality::class);
          $isset_nationality = $nationality_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_nationality) == 0) {

            $db->persist($nationality);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'La nacionalidad se ha creado correctamente.';

            $nationalitys = $nationality_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $nationalitys
            ];

            return $this->json($data);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'La nacionalidad ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'La nacionalidad no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'La nacionalidad no se ha creado.';
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
        $nationality_id = (!empty($json['id'])) ?  $json['id'] : null;

        if(!empty($name) && !empty($nationality_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $nationality_repo = $doctrine->getRepository(Nationality::class);
          $nationality = $nationality_repo->findOneBy(array(
            'id' => $nationality_id,
          ));

          $isset_nationality = $nationality_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_nationality) == 0 || $nationality->getName() == $name){

            $nationality->setName($name);
            $nationality->setUpdatedAt($date);

            $db->persist($nationality);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $nationalitys = $nationality_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $nationalitys
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Esta nacionalidad ya esta registrada.';
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

        $nationality_id = (!empty($json['nationality_id'])) ?  $json['nationality_id'] : null;
        if(!empty($nationality_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $nationality_repo = $doctrine->getRepository(Nationality::class);
          $nationality = $nationality_repo->findOneBy(array(
            'id' => $nationality_id,
          ));

          $nationality->setState(0);
          $nationality->setUpdatedAt($date);

          $db->persist($nationality);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $nationalitys = $nationality_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $nationalitys
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

        $nationality_id = (!empty($json['nationality_id'])) ?  $json['nationality_id'] : null;
        if(!empty($nationality_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $nationality_repo = $doctrine->getRepository(Nationality::class);
          $nationality = $nationality_repo->findOneBy(array(
            'id' => $nationality_id,
          ));

          $nationality->setState(1);
          $nationality->setUpdatedAt($date);

          $db->persist($nationality);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $nationalitys = $nationality_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $nationalitys
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

        $nationality_id = (!empty($json['nationality_id'])) ?  $json['nationality_id'] : null;
        if(!empty($nationality_id)) {

          $doctrine = $this->getDoctrine();
          $nationality_repo = $doctrine->getRepository(Nationality::class);
          $nationality = $nationality_repo->findOneBy(array(
            'id' => $nationality_id,
          ));

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos cargados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $nationality
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
