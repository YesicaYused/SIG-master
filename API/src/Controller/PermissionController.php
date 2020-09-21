<?php

namespace App\Controller;

use App\Entity\Icon;
use App\Entity\Permission;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Services\JwtAuth;

class PermissionController extends AbstractController
{
    public function index()
    {
      $permission = $this->getDoctrine()->getRepository(Permission::class);
      $permissions = $permission->findBy(array(
        'state' => 1
      ));

      return $this->json([
        'data' => $permissions,
      ]);
    }

    public function all()
    {
      $permission = $this->getDoctrine()->getRepository(Permission::class);
      $permissions = $permission->findAll();

      return $this->json([
        'data' => $permissions,
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
        $icon_id = $json['icon_id'];
        if (!empty($name) && !empty($icon_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();

          $icon_repo = $doctrine->getRepository(Icon::class);
          $icon = $icon_repo->findOneBy(array(
            'id' => $icon_id
          ));

          $permission = new Permission();
          $permission->setName($name);
          $permission->setIcon($icon);
          $permission->setCreatedAt($date);
          $permission->setUpdatedAt($date);

          $permission_repo = $doctrine->getRepository(Permission::class);
          $isset_permission = $permission_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_permission) == 0) {

            $db->persist($permission);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'El permiso se ha creado correctamente.';

            $permissions = $permission_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $permissions
            ];

            return $this->json($data);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'El permiso ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'El permiso no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'El permiso no se ha creado.';
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
        $permission_id = (!empty($json['id'])) ?  $json['id'] : null;
//        $icon_id = $json['icon_id'];

        if(!empty($name) && !empty($permission_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();

          $permission_repo = $doctrine->getRepository(Permission::class);
          $permission = $permission_repo->findOneBy(array(
            'id' => $permission_id,
          ));

          $isset_permission = $permission_repo->findBy(array(
            'name' => $name,
          ));

//          $icon_repo = $doctrine->getRepository(Icon::class);
//          $icon = $icon_repo->findOneBy(array(
//            'id' => $icon_id
//          ));

          if(count($isset_permission) == 0 || $permission->getName() == $name){

            $permission->setName($name);
//            $permission->setIcon($icon);
            $permission->setUpdatedAt($date);

            $db->persist($permission);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $permissions = $permission_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $permissions
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Este permiso ya esta registrado.';
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

        $permission_id = (!empty($json['permission_id'])) ?  $json['permission_id'] : null;
        if(!empty($permission_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();

          $permission_repo = $doctrine->getRepository(Permission::class);
          $permission = $permission_repo->findOneBy(array(
            'id' => $permission_id,
          ));
          $permission->setState(0);
          $permission->setUpdatedAt($date);

          $db->persist($permission);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $permissions = $permission_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $permissions
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

        $permission_id = (!empty($json['permission_id'])) ?  $json['permission_id'] : null;
        if(!empty($permission_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();

          $permission_repo = $doctrine->getRepository(Permission::class);
          $permission = $permission_repo->findOneBy(array(
            'id' => $permission_id,
          ));
          $permission->setState(1);
          $permission->setUpdatedAt($date);

          $db->persist($permission);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $permissions = $permission_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $permissions
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

        $permission_id = (!empty($json['permission_id'])) ?  $json['permission_id'] : null;
        if(!empty($permission_id)) {

          $doctrine = $this->getDoctrine();

          $permission_repo = $doctrine->getRepository(Permission::class);
          $permission = $permission_repo->findOneBy(array(
            'id' => $permission_id,
          ));
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos cargados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $permission
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
