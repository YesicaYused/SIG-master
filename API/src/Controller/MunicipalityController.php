<?php

namespace App\Controller;

use App\Entity\Department;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Municipality;
use App\Services\JwtAuth;

class MunicipalityController extends AbstractController
{

    public function index()
    {
      $municipality = $this->getDoctrine()->getRepository(Municipality::class);
      $municipalitys = $municipality->findBy(array(
        'state' => 1
      ));

      return $this->json([
        'data' => $municipalitys,
      ]);
    }

    public function all()
    {
      $municipality = $this->getDoctrine()->getRepository(Municipality::class);
      $municipalitys = $municipality->findAll();

      return $this->json([
        'data' => $municipalitys,
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

        $doctrine = $this->getDoctrine();
        $db = $doctrine->getManager();

        $name = $json['name'];
        $department_name = $json['department_name'];

        if (!empty($name) && !empty($department_name)) {

          $department_repo = $doctrine->getRepository(Department::class);
          $department = $department_repo->findOneBy(array(
            'name' => $department_name
          ));

          $municipality = new Municipality();
          $municipality->setName($name);
          $municipality->setDepartment($department);
          $municipality->setCreatedAt($date);
          $municipality->setUpdatedAt($date);

          $municipality_repo = $doctrine->getRepository(Municipality::class);
          $isset_municipality = $municipality_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_municipality) == 0) {

            $db->persist($municipality);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'El municipio se ha creado correctamente.';

            $municipalitys = $municipality_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $municipalitys
            ];

            return $this->json($data);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'El municipio ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'El municipio no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'El municipio no se ha creado.';
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
        $municipality_id = (!empty($json['id'])) ?  $json['id'] : null;
        $department_name = (!empty($json['department_name'])) ?  $json['department_name'] : null;

        if(!empty($name) && !empty($municipality_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();

          $department_repo = $doctrine->getRepository(Department::class);
          $department = $department_repo->findOneBy(array(
            'name' => $department_name
          ));

          $municipality_repo = $doctrine->getRepository(Municipality::class);
          $municipality = $municipality_repo->findOneBy(array(
            'id' => $municipality_id,
          ));

          $isset_municipality = $municipality_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_municipality) == 0 || $municipality->getName() == $name){

            $municipality->setName($name);
            $municipality->setDepartment($department);
            $municipality->setUpdatedAt($date);

            $db->persist($municipality);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $municipalitys = $municipality_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $municipalitys
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Este municipio ya esta registrado.';
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

        $municipality_id = (!empty($json['municipality_id'])) ?  $json['municipality_id'] : null;
        if(!empty($municipality_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $municipality_repo = $doctrine->getRepository(Municipality::class);
          $municipality = $municipality_repo->findOneBy(array(
            'id' => $municipality_id,
          ));
          $municipality->setState(0);
          $municipality->setUpdatedAt($date);

          $db->persist($municipality);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $municipalitys = $municipality_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $municipalitys
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

        $municipality_id = (!empty($json['municipality_id'])) ?  $json['municipality_id'] : null;
        if(!empty($municipality_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $municipality_repo = $doctrine->getRepository(Municipality::class);
          $municipality = $municipality_repo->findOneBy(array(
            'id' => $municipality_id,
          ));
          $municipality->setState(1);
          $municipality->setUpdatedAt($date);

          $db->persist($municipality);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $municipalitys = $municipality_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $municipalitys
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

        $municipality_id = (!empty($json['municipality_id'])) ?  $json['municipality_id'] : null;
        if(!empty($municipality_id)) {

          $doctrine = $this->getDoctrine();
          $municipality_repo = $doctrine->getRepository(Municipality::class);
          $municipality = $municipality_repo->findOneBy(array(
            'id' => $municipality_id,
          ));

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos cargados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $municipality
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
