<?php

namespace App\Controller;

use App\Entity\Module;
use App\Entity\ModuleProfile;
use App\Entity\Person;
use App\Entity\PersonProfile;
use App\Entity\Profile;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Services\JwtAuth;
use function MongoDB\Driver\Monitoring\removeSubscriber;

class ModuleProfileController extends AbstractController
{
  public function index()
  {
    $module_profile = $this->getDoctrine()->getRepository(ModuleProfile::class);
    $module_profiles = $module_profile->findBy(array(
      'state' => 1
    ));

    return $this->json([
      'data' => $module_profiles,
    ]);
  }

  public function all()
  {
    $module_profile = $this->getDoctrine()->getRepository(ModuleProfile::class);
    $module_profiles = $module_profile->findAll();

    return $this->json([
      'data' => $module_profiles,
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

        $module_id = $json['module_id'];
        $profile_id = $json['profile_id'];

        if (!empty($module_id) && !empty($profile_id)) {
//
          $module_repo = $doctrine->getRepository(Module::class);
          $module = $module_repo->findOneBy(array(
            'id' => $module_id
          ));

          $profile_repo = $doctrine->getRepository(Profile::class);
          $profile = $profile_repo->findOneBy(array(
            'id' => $profile_id
          ));
//
          $module_profile = new ModuleProfile();
          $module_profile->setProfile($profile);
          $module_profile->setModule($module);
          $module_profile->setCreatedAt($date);
          $module_profile->setUpdatedAt($date);

          $module_profile_repo = $doctrine->getRepository(ModuleProfile::class);
          $isset_module_profile = $module_profile_repo->findBy(array(
            'profile' => $profile_id,
            'module' => $module_id,
          ));

          if (count($isset_module_profile) == 0) {

            $db->persist($module_profile);
            $db->flush();

            $db = $doctrine->getConnection();

            $query = "SELECT * FROM profile p
                    WHERE p.id NOT IN
                    (SELECT p.id FROM profile p
                    INNER JOIN module_profile mp
                    ON p.id = mp.profile_id
                    WHERE mp.module_id = $module_id)";

            $stmt = $db->prepare($query);
            $params = array();
            $stmt->execute($params);
            $result = $stmt->fetchAll();

            $module_profile = $this->getDoctrine()->getRepository(ModuleProfile::class);
            $module_profiles = $module_profile->findAll();

            $array = [
              'status' => 'success',
              'message' => 'Modulo - Perfil agregados correctamente.',
              'profile' => $result,
              'people' => $module_profiles
            ];

            return $this->json($array);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = '';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'El Modulo - Perfil no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'El Modulo - Perfil no se ha creado.';
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

        $doctrine = $this->getDoctrine();
        $db = $doctrine->getManager();

        $module_id = $json['module_id'];
        $profile_id = $json['profile_id'];
        $module_profile_id = $json['module_profile_id'];

        if (!empty($module_id) && !empty($profile_id)) {
//
          $module_repo = $doctrine->getRepository(Module::class);
          $module = $module_repo->findOneBy(array(
            'id' => $module_id
          ));

          $profile_repo = $doctrine->getRepository(Profile::class);
          $profile = $profile_repo->findOneBy(array(
            'id' => $profile_id
          ));


          $mod_prof_repo = $doctrine->getRepository(ModuleProfile::class);
          $isset_module_profile = $mod_prof_repo->findBy(array(
            'profile' => $profile_id,
            'module' => $module_id,
          ));

          $module_profile_repo = $doctrine->getRepository(ModuleProfile::class);
          $module_profile = $module_profile_repo->findOneBy(array(
            'id' => $module_profile_id,
          ));

          if (count($isset_module_profile) == 0) {

            $module_profile->setProfile($profile);
            $module_profile->setModule($module);
            $module_profile->setUpdatedAt($date);

            $db->persist($module_profile);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Este Modulo - Perfil ya esta registrado.';
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

    return $this->json([
      'data' => $data,
    ]);
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

        $doctrine = $this->getDoctrine();
        $db = $doctrine->getManager();
        $module_profile_id = $json['module_profile_id'];
        if (!empty($module_profile_id)) {

          $module_profile_repo = $doctrine->getRepository(ModuleProfile::class);
          $module_profile = $module_profile_repo->findOneBy(array(
            'id' => $module_profile_id,
          ));

          $module_profile->setState(0);
          $module_profile->setUpdatedAt($date);

          $db->persist($module_profile);
          $db->flush();

          $module_profile = $this->getDoctrine()->getRepository(ModuleProfile::class);
          $module_profiles = $module_profile->findAll();

          $array = [
            'status' => 'success',
            'message' => 'Datos deshabilitados correctamente.',
            'data' => $module_profiles,
          ];

          return $this->json($array);
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

    return $this->json([
      'data' => $data,
    ]);
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

        $doctrine = $this->getDoctrine();
        $db = $doctrine->getManager();
        $module_profile_id = $json['module_profile_id'];
        if (!empty($module_profile_id)) {

          $module_profile_repo = $doctrine->getRepository(ModuleProfile::class);
          $module_profile = $module_profile_repo->findOneBy(array(
            'id' => $module_profile_id,
          ));

          $module_profile->setState(1);
          $module_profile->setUpdatedAt($date);

          $db->persist($module_profile);
          $db->flush();

          $module_profile = $this->getDoctrine()->getRepository(ModuleProfile::class);
          $module_profiles = $module_profile->findAll();

          $array = [
            'status' => 'success',
            'message' => 'Datos habilitados correctamente.',
            'data' => $module_profiles,
          ];

          return $this->json($array);
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

    return $this->json([
      'data' => $data,
    ]);
  }

  public function getModuleProfile(Request $request, JwtAuth $jwt_auth)
  {
    $json = $request->getContent();
    $json = json_decode($json, true);
    $token = $request->headers->get('authorization');
    $authCheck = $jwt_auth->checkToken($token);
    if ($authCheck) {
      if($json != null){

        $code = $json['code'];
        $profile_name = $json['profile_name'];

        $doctrine = $this->getDoctrine();

        $profile_repo = $doctrine->getRepository(ModuleProfile::class);
        $profile = $profile_repo->findOneBy(array(
          'name' => $profile_name,
        ));

        $db = $doctrine->getConnection();

        if (!empty($code)) {

          $query = "SELECT pr.* FROM person p
                    INNER JOIN person_profile pp
                    ON p.id = pp.person_id
                    INNER JOIN profile pr
                    ON pr.id = pp.profile_id
                    WHERE p.code = $code";

          $stmt = $db->prepare($query);
          $params = array();
          $stmt->execute($params);
          $result = $stmt->fetchAll();

          $status = 'success';
          $code = 200;
          $mensaje = $result;
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

    return $this->json([
      'data' => $data,
    ]);
  }
}
