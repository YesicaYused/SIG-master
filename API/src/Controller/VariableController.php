<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Variable;
use App\Services\JwtAuth;

class VariableController extends AbstractController
{
    public function index()
    {
      $variable = $this->getDoctrine()->getRepository(Variable::class);
      $variables = $variable->findBy(array(
        'state' => 1
      ));

      return $this->json([
        'data' => $variables,
      ]);
    }

    public function all()
    {
      $variable = $this->getDoctrine()->getRepository(Variable::class);
      $variables = $variable->findAll();

      return $this->json([
        'data' => $variables,
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

          $variable = new Variable();
          $variable->setName($name);
          $variable->setCreatedAt($date);
          $variable->setUpdatedAt($date);

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $variable_repo = $doctrine->getRepository(Variable::class);
          $isset_variable = $variable_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_variable) == 0) {

            $db->persist($variable);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'La variable se ha creado correctamente.';

            $variables = $variable_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $variables
            ];

            return $this->json($data);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'La variable ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'La variable no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'La variable no se ha creado.';
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
        $variable_id = (!empty($json['id'])) ?  $json['id'] : null;

        if(!empty($name) && !empty($variable_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $variable_repo = $doctrine->getRepository(Variable::class);
          $variable = $variable_repo->findOneBy(array(
            'id' => $variable_id,
          ));

          $isset_variable = $variable_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_variable) == 0 || $variable->getName() == $name){

            $variable->setName($name);
            $variable->setUpdatedAt($date);

            $db->persist($variable);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $variables = $variable_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $variables
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Esta variable ya esta registrada.';
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

        $variable_id = (!empty($json['variable_id'])) ?  $json['variable_id'] : null;

        if(!empty($variable_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $variable_repo = $doctrine->getRepository(Variable::class);
          $variable = $variable_repo->findOneBy(array(
            'id' => $variable_id,
          ));

          $variable->setState(0);
          $variable->setUpdatedAt($date);

          $db->persist($variable);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $variables = $variable_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $variables
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

        $variable_id = (!empty($json['variable_id'])) ?  $json['variable_id'] : null;

        if(!empty($variable_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $variable_repo = $doctrine->getRepository(Variable::class);
          $variable = $variable_repo->findOneBy(array(
            'id' => $variable_id,
          ));

          $variable->setState(1);
          $variable->setUpdatedAt($date);

          $db->persist($variable);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $variables = $variable_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $variables
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

        $variable_id = (!empty($json['variable_id'])) ?  $json['variable_id'] : null;

        if(!empty($variable_id)) {

          $doctrine = $this->getDoctrine();
          $variable_repo = $doctrine->getRepository(Variable::class);
          $variable = $variable_repo->findOneBy(array(
            'id' => $variable_id,
          ));

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos cargados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $variable
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
