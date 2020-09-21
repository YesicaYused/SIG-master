<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Neighborhood;
use App\Services\JwtAuth;

class NeighborhoodController extends AbstractController
{
    public function index()
    {
      $neighborhood = $this->getDoctrine()->getRepository(Neighborhood::class);
      $neighborhoods = $neighborhood->findBy(array(
        'state' => 1
      ));

      return $this->json([
        'data' => $neighborhoods,
      ]);
    }

    public function all()
    {
      $neighborhood = $this->getDoctrine()->getRepository(Neighborhood::class);
      $neighborhoods = $neighborhood->findAll();

      return $this->json([
        'data' => $neighborhoods,
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

          $neighborhood = new Neighborhood();
          $neighborhood->setName($name);
          $neighborhood->setCreatedAt($date);
          $neighborhood->setUpdatedAt($date);

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $neighborhood_repo = $doctrine->getRepository(Neighborhood::class);
          $isset_neighborhood = $neighborhood_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_neighborhood) == 0) {

            $db->persist($neighborhood);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'El barrio se ha creado correctamente.';

            $neighborhoods = $neighborhood_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $neighborhoods
            ];

            return $this->json($data);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'El barrio ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'El barrio no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'El barrio no se ha creado.';
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
        $neighborhood_id = (!empty($json['id'])) ?  $json['id'] : null;

        if(!empty($name) && !empty($neighborhood_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $neighborhood_repo = $doctrine->getRepository(Neighborhood::class);
          $neighborhood = $neighborhood_repo->findOneBy(array(
            'id' => $neighborhood_id,
          ));

          $isset_neighborhood = $neighborhood_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_neighborhood) == 0 || $neighborhood->getName() == $name){

            $neighborhood->setName($name);
            $neighborhood->setUpdatedAt($date);

            $db->persist($neighborhood);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $neighborhoods = $neighborhood_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $neighborhoods
            ];

            return $this->json($data);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Este barrio ya existe.';
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

        $neighborhood_id = (!empty($json['neighborhood_id'])) ?  $json['neighborhood_id'] : null;
        if(!empty($neighborhood_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $neighborhood_repo = $doctrine->getRepository(Neighborhood::class);
          $neighborhood = $neighborhood_repo->findOneBy(array(
            'id' => $neighborhood_id,
          ));
          $neighborhood->setState(0);
          $neighborhood->setUpdatedAt($date);

          $db->persist($neighborhood);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $neighborhoods = $neighborhood_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $neighborhoods
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

        $neighborhood_id = (!empty($json['neighborhood_id'])) ?  $json['neighborhood_id'] : null;
        if(!empty($neighborhood_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $neighborhood_repo = $doctrine->getRepository(Neighborhood::class);
          $neighborhood = $neighborhood_repo->findOneBy(array(
            'id' => $neighborhood_id,
          ));
          $neighborhood->setState(1);
          $neighborhood->setUpdatedAt($date);

          $db->persist($neighborhood);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $neighborhoods = $neighborhood_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $neighborhoods
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

        $neighborhood_id = (!empty($json['neighborhood_id'])) ?  $json['neighborhood_id'] : null;
        if(!empty($neighborhood_id)) {

          $doctrine = $this->getDoctrine();
          $neighborhood_repo = $doctrine->getRepository(Neighborhood::class);
          $neighborhood = $neighborhood_repo->findOneBy(array(
            'id' => $neighborhood_id,
          ));

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos cargados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $neighborhood
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
