<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\SiteClass;
use App\Services\JwtAuth;

class SiteClassController extends AbstractController
{
    public function index()
    {
      $siteClass = $this->getDoctrine()->getRepository(SiteClass::class);
      $sitesClass = $siteClass->findBy(array(
        'state' => 1
      ));

      return $this->json([
        'data' => $sitesClass,
      ]);
    }

    public function all()
    {
      $siteClass = $this->getDoctrine()->getRepository(SiteClass::class);
      $sitesClass = $siteClass->findAll();

      return $this->json([
        'data' => $sitesClass,
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

          $siteClass = new SiteClass();
          $siteClass->setName($name);
          $siteClass->setCreatedAt($date);
          $siteClass->setUpdatedAt($date);

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $siteClass_repo = $doctrine->getRepository(SiteClass::class);
          $isset_siteClass = $siteClass_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_siteClass) == 0) {

            $db->persist($siteClass);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'La clase de sitio se ha creado correctamente.';

            $sitesClass = $siteClass_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $sitesClass
            ];

            return $this->json($data);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'La clase de sitio ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'La clase de sitio no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'La clase de sitio no se ha creado.';
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
        $site_class_id = (!empty($json['id'])) ?  $json['id'] : null;

        if(!empty($name) && !empty($site_class_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $site_class_repo = $doctrine->getRepository(SiteClass::class);
          $site_class = $site_class_repo->findOneBy(array(
            'id' => $site_class_id,
          ));

          $isset_site_class = $site_class_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_site_class) == 0 || $site_class->getName() == $name){

            $site_class->setName($name);
            $site_class->setUpdatedAt($date);

            $db->persist($site_class);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $sitesClass = $site_class_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $sitesClass
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Esta clase de sitio ya esta registrada.';
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

        $site_class_id = (!empty($json['site_class_id'])) ?  $json['site_class_id'] : null;
        if(!empty($site_class_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $site_class_repo = $doctrine->getRepository(SiteClass::class);
          $site_class = $site_class_repo->findOneBy(array(
            'id' => $site_class_id,
          ));
          $site_class->setState(0);
          $site_class->setUpdatedAt($date);

          $db->persist($site_class);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $sitesClass = $site_class_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $sitesClass
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

        $site_class_id = (!empty($json['site_class_id'])) ?  $json['site_class_id'] : null;
        if(!empty($site_class_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $site_class_repo = $doctrine->getRepository(SiteClass::class);
          $site_class = $site_class_repo->findOneBy(array(
            'id' => $site_class_id,
          ));
          $site_class->setState(1);
          $site_class->setUpdatedAt($date);

          $db->persist($site_class);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $sitesClass = $site_class_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $sitesClass
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

        $site_class_id = (!empty($json['site_class_id'])) ?  $json['site_class_id'] : null;
        if(!empty($site_class_id)) {

          $doctrine = $this->getDoctrine();
          $site_class_repo = $doctrine->getRepository(SiteClass::class);
          $site_class = $site_class_repo->findOneBy(array(
            'id' => $site_class_id,
          ));

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos cargados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $site_class
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
