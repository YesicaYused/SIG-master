<?php

namespace App\Controller;

use App\Entity\IconTheme;
use App\Entity\IconType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Icon;
use App\Services\JwtAuth;

class IconController extends AbstractController
{
    public function index()
    {
      $icon = $this->getDoctrine()->getRepository(Icon::class);
      $icons = $icon->findBy(array(
        'state' => 1
      ));

      return $this->json([
        'data' => $icons,
      ]);
    }

    public function all()
    {
      $icon = $this->getDoctrine()->getRepository(Icon::class);
      $icons = $icon->findAll();

      return $this->json([
        'data' => $icons,
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
        $icon_type_id = $json['icon_type_id'];
        $icon_theme_id = $json['icon_theme_id'];

        if (!empty($name) && !empty($icon_type_id) && !empty($icon_theme_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();

          $icon_type_repo = $doctrine->getRepository(IconType::class);
          $icon_type = $icon_type_repo->findOneBy(array(
            'id' => $icon_type_id
          ));

          $icon_theme_repo = $doctrine->getRepository(IconTheme::class);
          $icon_theme = $icon_theme_repo->findOneBy(array(
            'id' => $icon_theme_id
          ));

          $icon = new Icon();
          $icon->setName($name);
          $icon->setIconType($icon_type);
          $icon->setIconTheme($icon_theme);
          $icon->setCreatedAt($date);
          $icon->setUpdatedAt($date);

          $icon_repo = $doctrine->getRepository(Icon::class);
          $isset_icon = $icon_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_icon) == 0) {

            $db->persist($icon);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'El icono se ha creado correctamente.';

            $icons = $icon_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $icons
            ];

            return $this->json($data);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'El icono ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'El icono no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'El icono no se ha creado.';
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
        $icon_id = (!empty($json['id'])) ?  $json['id'] : null;
        $icon_type_id = $json['icon_type_id'];
        $icon_theme_id = $json['icon_theme_id'];

        if(!empty($name) && !empty($icon_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $icon_repo = $doctrine->getRepository(Icon::class);
          $icon = $icon_repo->findOneBy(array(
            'id' => $icon_id,
          ));

          $icon_type_repo = $doctrine->getRepository(IconType::class);
          $icon_type = $icon_type_repo->findOneBy(array(
            'id' => $icon_type_id
          ));

          $icon_theme_repo = $doctrine->getRepository(IconTheme::class);
          $icon_theme = $icon_theme_repo->findOneBy(array(
            'id' => $icon_theme_id
          ));

          $isset_icon = $icon_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_icon) == 0 || $icon->getName() == $name){

            $icon->setName($name);
            $icon->setIconType($icon_type);
            $icon->setIconTheme($icon_theme);
            $icon->setUpdatedAt($date);

            $db->persist($icon);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $icons = $icon_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $icons
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Este icono ya esta registrado.';
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

        $icon_id = (!empty($json['icon_id'])) ?  $json['icon_id'] : null;
        if(!empty($icon_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $icon_repo = $doctrine->getRepository(Icon::class);
          $icon = $icon_repo->findOneBy(array(
            'id' => $icon_id,
          ));

          $icon->setState(0);
          $icon->setUpdatedAt($date);

          $db->persist($icon);
          $db->flush();

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $icons = $icon_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $icons
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

        $icon_id = (!empty($json['icon_id'])) ?  $json['icon_id'] : null;
        if(!empty($icon_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $icon_repo = $doctrine->getRepository(Icon::class);
          $icon = $icon_repo->findOneBy(array(
            'id' => $icon_id,
          ));

          $icon->setState(1);
          $icon->setUpdatedAt($date);

          $db->persist($icon);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $icons = $icon_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $icons
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

        $icon_id = (!empty($json['icon_id'])) ?  $json['icon_id'] : null;
        if(!empty($icon_id)) {

          $doctrine = $this->getDoctrine();
          $icon_repo = $doctrine->getRepository(Icon::class);
          $icon = $icon_repo->findOneBy(array(
            'id' => $icon_id,
          ));

          $icon->setState(1);
          $icon->setUpdatedAt($date);

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos modificados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $icon
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
