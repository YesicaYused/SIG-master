<?php

namespace App\Controller;

use App\Entity\Permission;
use App\Entity\PermissionProfile;
use App\Entity\Profile;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Services\JwtAuth;

class PermissionProfileController extends AbstractController
{
  public function index()
  {
    $permission_profile = $this->getDoctrine()->getRepository(PermissionProfile::class);
    $permission_profiles = $permission_profile->findBy(array(
      'state' => 1
    ));

    return $this->json([
      'data' => $permission_profiles,
    ]);
  }

  public function all()
  {
    $permission_profile = $this->getDoctrine()->getRepository(PermissionProfile::class);
    $permission_profiles = $permission_profile->findAll();

    return $this->json([
      'data' => $permission_profiles,
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

        $permission_id = $json['permission_id'];
        $profile_id = $json['profile_id'];

        if (!empty($permission_id) && !empty($profile_id)) {
//
          $permission_repo = $doctrine->getRepository(Permission::class);
          $permission = $permission_repo->findOneBy(array(
            'id' => $permission_id
          ));

          $profile_repo = $doctrine->getRepository(Profile::class);
          $profile = $profile_repo->findOneBy(array(
            'id' => $profile_id
          ));
//
          $permission_profile = new PermissionProfile();
          $permission_profile->setpermission($permission);
          $permission_profile->setProfile($profile);
          $permission_profile->setCreatedAt($date);
          $permission_profile->setUpdatedAt($date);

          $permission_profile_repo = $doctrine->getRepository(PermissionProfile::class);
          $isset_permission_profile = $permission_profile_repo->findBy(array(
            'permission' => $permission_id,
            'profile' => $profile_id,
          ));

          if (count($isset_permission_profile) == 0) {

            $db->persist($permission_profile);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'El permiso - perfil se ha creado correctamente.';
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'El permiso - perfil se ha creado correctamente.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'El permiso - perfil no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'El permiso - perfil no se ha creado.';
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

        $permission_id = $json['permission_id'];
        $profile_id = $json['profile_id'];
        $permission_profile_id = (!empty($json['permission_profile_id'])) ?  $json['permission_profile_id'] : null;

        if(!empty($permission_id) && !empty($profile_id) && !empty($permission_profile_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();

          $permission_repo = $doctrine->getRepository(Permission::class);
          $permission = $permission_repo->findOneBy(array(
            'id' => $permission_id
          ));

          $profile_repo = $doctrine->getRepository(Profile::class);
          $profile = $profile_repo->findOneBy(array(
            'id' => $profile_id
          ));

          $permission_profile_repo = $doctrine->getRepository(PermissionProfile::class);
          $permission_profile = $permission_profile_repo->findOneBy(array(
            'id' => $permission_profile_id,
          ));

          $permi_prof_repo = $doctrine->getRepository(PermissionProfile::class);
          $isset_permi_prof = $permi_prof_repo->findBy(array(
            'permission' => $permission_id,
            'profile' => $profile_id,
          ));

          if (count($isset_permi_prof) == 0) {

            $permission_profile->setpermission($permission);
            $permission_profile->setProfile($profile);
            $permission_profile->setUpdatedAt($date);

            $db->persist($permission_profile);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Este permiso - perfil ya esta registrado.';
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

        $permission_profile_id = (!empty($json['permission_profile_id'])) ?  $json['permission_profile_id'] : null;
        if(!empty($permission_profile_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();

          $permission_profile_repo = $doctrine->getRepository(PermissionProfile::class);
          $permission_profile = $permission_profile_repo->findOneBy(array(
            'id' => $permission_profile_id,
          ));

          $permission_profile->setState(0);
          $permission_profile->setUpdatedAt($date);

          $db->persist($permission_profile);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';
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

        $permission_profile_id = (!empty($json['permission_profile_id'])) ?  $json['permission_profile_id'] : null;
        if(!empty($permission_profile_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();

          $permission_profile_repo = $doctrine->getRepository(PermissionProfile::class);
          $permission_profile = $permission_profile_repo->findOneBy(array(
            'id' => $permission_profile_id,
          ));

          $permission_profile->setState(1);
          $permission_profile->setUpdatedAt($date);

          $db->persist($permission_profile);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';
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
