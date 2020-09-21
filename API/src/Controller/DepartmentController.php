<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\Department;
use Symfony\Component\HttpFoundation\Request;
use App\Services\JwtAuth;

class DepartmentController extends AbstractController
{
    public function index()
    {

      $departmet = $this->getDoctrine()->getRepository(Department::class);
      $departmets = $departmet->findBy(array(
        'state' => 1
      ));

        return $this->json([
            'data' => $departmets,
        ]);
    }

    public function all()
    {

      $departmet = $this->getDoctrine()->getRepository(Department::class);
      $departmets = $departmet->findAll();

        return $this->json([
            'data' => $departmets,
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

            $department = new Department();
            $department->setName($name);
            $department->setCreatedAt($date);
            $department->setUpdatedAt($date);

            $doctrine = $this->getDoctrine();
            $db = $doctrine->getManager();
            $department_repo = $doctrine->getRepository(Department::class);
            $isset_department = $department_repo->findBy(array(
              'name' => $name
            ));

            if (count($isset_department) == 0) {

              $db->persist($department);
              $db->flush();

              $status = 'success';
              $code = 200;
              $mensaje = 'El departamento se ha creado correctamente.';

              $departments = $department_repo->findAll();

              $data = [
                'status' => $status,
                'code' => $code,
                'message' => $mensaje,
                'data' => $departments
              ];

              return $this->json($data);
            } else {

              $status = 'error';
              $code = 400;
              $mensaje = 'El departamento ya existe.';
            }
          } else {

            $status = 'error';
            $code = 200;
            $mensaje = 'El departamento no se ha creado.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'El departamento no se ha creado.';
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
        $department_id = (!empty($json['id'])) ?  $json['id'] : null;

        if(!empty($name) && !empty($department_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $department_repo = $doctrine->getRepository(Department::class);
          $department = $department_repo->findOneBy(array(
            'id' => $department_id,
          ));

          $isset_department = $department_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_department) == 0 || $department->getName() == $name){

            $department->setName($name);
            $department->setUpdatedAt($date);

            $db->persist($department);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $departments = $department_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $departments
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Este departamento ya esta registrado.';
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

        $department_id = (!empty($json['department_id'])) ?  $json['department_id'] : null;

        if(!empty($department_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $department_repo = $doctrine->getRepository(Department::class);
          $department = $department_repo->findOneBy(array(
            'id' => $department_id,
          ));

          $department->setState(0);
          $department->setUpdatedAt($date);

          $db->persist($department);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $departments = $department_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $departments
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

        $department_id = (!empty($json['department_id'])) ?  $json['department_id'] : null;

        if(!empty($department_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $department_repo = $doctrine->getRepository(Department::class);
          $department = $department_repo->findOneBy(array(
            'id' => $department_id,
          ));

          $department->setState(1);
          $department->setUpdatedAt($date);

          $db->persist($department);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $departments = $department_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $departments
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

        $department_id = (!empty($json['department_id'])) ?  $json['department_id'] : null;

        if(!empty($department_id)) {

          $doctrine = $this->getDoctrine();
          $department_repo = $doctrine->getRepository(Department::class);
          $department = $department_repo->findOneBy(array(
            'id' => $department_id,
          ));

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos a modificar.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $department
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
