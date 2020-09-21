<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Setting;
use App\Services\JwtAuth;

class SettingController extends AbstractController
{
    public function index()
    {
      $setting = $this->getDoctrine()->getRepository(Setting::class);
      $settings = $setting->findAll();

      return $this->json([
        'data' => $settings,
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

          $setting = new Setting();
          $setting->setName($name);
          $setting->setCreatedAt($date);
          $setting->setUpdatedAt($date);

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $setting_repo = $doctrine->getRepository(Setting::class);
          $isset_setting = $setting_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_setting) == 0) {

            $db->persist($setting);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'La configuración se ha creado correctamente.';
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'La configuración ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'La configuración no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'La configuración no se ha creado.';
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

        $name = (!empty($json['name'])) ?  $json['name'] : null;
        $cause_id = (!empty($json['cause_id'])) ?  $json['cause_id'] : null;

        if(!empty($name) && !empty($cause_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $cause_repo = $doctrine->getRepository(Cause::class);
          $cause = $cause_repo->findOneBy(array(
            'id' => $cause_id,
          ));

          $isset_cause = $cause_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_cause) == 0 || $cause->getName() == $name){

            $cause->setName($name);
            $cause->setUpdatedAt($date);

            $db->persist($cause);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Esta configuración ya esta registrada.';
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
