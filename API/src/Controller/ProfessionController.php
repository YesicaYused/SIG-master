<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Profession;
use App\Services\JwtAuth;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class ProfessionController extends AbstractController
{
    public function index()
    {
      $profession = $this->getDoctrine()->getRepository(Profession::class);
      $professions = $profession->findBy(array(
        'state' => 1
      ));

      return $this->json($professions, Response::HTTP_OK, [], [
        ObjectNormalizer::IGNORED_ATTRIBUTES => ['legalCase'],
      ]);
    }

    public function all()
    {
      $profession = $this->getDoctrine()->getRepository(Profession::class);
      $professions = $profession->findAll();

      return $this->json($professions, Response::HTTP_OK, [], [
        ObjectNormalizer::IGNORED_ATTRIBUTES => ['legalCase'],
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

          $profession = new Profession();
          $profession->setName($name);
          $profession->setCreatedAt($date);
          $profession->setUpdatedAt($date);

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $profession_repo = $doctrine->getRepository(Profession::class);
          $isset_profession = $profession_repo->findBy(array(
            'name' => $name
          ));

          if (count($isset_profession) == 0) {

            $db->persist($profession);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'La profesión se ha creado correctamente.';

            $professions = $profession_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $professions
            ];

            return $this->json($data, Response::HTTP_OK, [], [
              ObjectNormalizer::IGNORED_ATTRIBUTES => ['legalCase'],
            ]);
          } else {

            $status = 'error';
            $code = 400;
            $mensaje = 'La profesión ya existe.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'La profesión no se ha creado.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'La profesión no se ha creado.';
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
        $profession_id = (!empty($json['id'])) ?  $json['id'] : null;

        if(!empty($name) && !empty($profession_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $profession_repo = $doctrine->getRepository(Profession::class);
          $profession = $profession_repo->findOneBy(array(
            'id' => $profession_id,
          ));

          $isset_profession = $profession_repo->findBy(array(
            'name' => $name,
          ));

          if(count($isset_profession) == 0 || $profession->getName() == $name){

            $profession->setName($name);
            $profession->setUpdatedAt($date);

            $db->persist($profession);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

            $professions = $profession_repo->findAll();

            $data = [
              'status' => $status,
              'code' => $code,
              'message' => $mensaje,
              'data' => $professions
            ];

            return $this->json($data, Response::HTTP_OK, [], [
              ObjectNormalizer::IGNORED_ATTRIBUTES => ['legalCase'],
            ]);

          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Esta profesión ya esta registrada.';
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

        $profession_id = (!empty($json['profession_id'])) ?  $json['profession_id'] : null;
        if(!empty($profession_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $profession_repo = $doctrine->getRepository(Profession::class);
          $profession = $profession_repo->findOneBy(array(
            'id' => $profession_id,
          ));

          $profession->setState(0);
          $profession->setUpdatedAt($date);

          $db->persist($profession);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $professions = $profession_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $professions
          ];

          return $this->json($data, Response::HTTP_OK, [], [
            ObjectNormalizer::IGNORED_ATTRIBUTES => ['legalCase'],
          ]);
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

        $profession_id = (!empty($json['profession_id'])) ?  $json['profession_id'] : null;
        if(!empty($profession_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $profession_repo = $doctrine->getRepository(Profession::class);
          $profession = $profession_repo->findOneBy(array(
            'id' => $profession_id,
          ));

          $profession->setState(1);
          $profession->setUpdatedAt($date);

          $db->persist($profession);
          $db->flush();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $professions = $profession_repo->findAll();

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $professions
          ];

          return $this->json($data, Response::HTTP_OK, [], [
            ObjectNormalizer::IGNORED_ATTRIBUTES => ['legalCase'],
          ]);
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

        $profession_id = (!empty($json['profession_id'])) ?  $json['profession_id'] : null;
        if(!empty($profession_id)) {

          $doctrine = $this->getDoctrine();
          $profession_repo = $doctrine->getRepository(Profession::class);
          $profession = $profession_repo->findOneBy(array(
            'id' => $profession_id,
          ));

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos cargados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $profession
          ];

          return $this->json($data, Response::HTTP_OK, [], [
            ObjectNormalizer::IGNORED_ATTRIBUTES => ['legalCase'],
          ]);
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
