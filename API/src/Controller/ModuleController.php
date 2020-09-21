<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Module;
use App\Services\JwtAuth;

class ModuleController extends AbstractController
{
    public function index()
    {
      $module = $this->getDoctrine()->getRepository(Module::class);
      $modules = $module->findBy(array(
        'state' => 1
      ));

      return $this->json([
        'data' => $modules,
      ]);
    }

    public function all()
    {
      $module = $this->getDoctrine()->getRepository(Module::class);
      $modules = $module->findAll();

      return $this->json([
        'data' => $modules,
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
        $route = $json['route'];
        if (!empty($name)) {

          $module = new Module();
          $module->setName($name);
          $module->setRoute($route);
          $module->setCreatedAt($date);
          $module->setUpdatedAt($date);

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $module_repo = $doctrine->getRepository(Module::class);
          $isset_module = $module_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_module) == 0) {

            $db->persist($module);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'El modulo se ha creado correctamente.';

            $modules = $module_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $modules
            ];

            return $this->json($data);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'El modulo ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'El modulo no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'El modulo no se ha creado.';
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
        $route = (!empty($json['route'])) ?  $json['route'] : null;
        $module_id = (!empty($json['id'])) ?  $json['id'] : null;

        if(!empty($name) && !empty($module_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $module_repo = $doctrine->getRepository(Module::class);
          $module = $module_repo->findOneBy(array(
            'id' => $module_id,
          ));

          $isset_module = $module_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_module) == 0 || $module->getName() == $name){

            $module->setName($name);
            $module->setRoute($route);
            $module->setUpdatedAt($date);

            $db->persist($module);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $modules = $module_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $modules
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Este modulo ya esta registrado.';
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

        $module_id = (!empty($json['module_id'])) ?  $json['module_id'] : null;
        if(!empty($module_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $module_repo = $doctrine->getRepository(Module::class);
          $module = $module_repo->findOneBy(array(
            'id' => $module_id,
          ));
          $module->setState(0);
          $module->setUpdatedAt($date);

          $db->persist($module);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $modules = $module_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $modules
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

        $module_id = (!empty($json['module_id'])) ?  $json['module_id'] : null;
        if(!empty($module_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $module_repo = $doctrine->getRepository(Module::class);
          $module = $module_repo->findOneBy(array(
            'id' => $module_id,
          ));
          $module->setState(1);
          $module->setUpdatedAt($date);

          $db->persist($module);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $modules = $module_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $modules
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

        $module_id = (!empty($json['module_id'])) ?  $json['module_id'] : null;
        if(!empty($module_id)) {

          $doctrine = $this->getDoctrine();
          $module_repo = $doctrine->getRepository(Module::class);
          $module = $module_repo->findOneBy(array(
            'id' => $module_id,
          ));

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos cargados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $module
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

  public function queryProfile(Request $request, JwtAuth $jwt_auth)
  {
    $json = $request->getContent();
    $json = json_decode($json, true);
    $token = $request->headers->get('authorization');
    $authCheck = $jwt_auth->checkToken($token);
    if ($authCheck) {
      if($json != null){

        $id = (!empty($json['id'])) ?  $json['id'] : null;
        if(!empty($id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getConnection();

          $query = "SELECT * FROM profile p
                    WHERE p.id NOT IN
                    (SELECT p.id FROM profile p
                    INNER JOIN module_profile mp
                    ON p.id = mp.profile_id
                    WHERE mp.module_id = $id)";

          $stmt = $db->prepare($query);
          $params = array();
          $stmt->execute($params);
          $result = $stmt->fetchAll();

          $array = [
            'status' => 'success',
            'message' => 'Perfiles disponibles',
            'profile' => $result,
          ];
          return $this->json($array);
        }else{
          $status = 'error';
          $code = 400;
          $mensaje = 'Todos los campos son requeridos.';
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

    return $this->json([
      'data' => $data,
    ]);
  }
}
