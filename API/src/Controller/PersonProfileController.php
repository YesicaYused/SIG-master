<?php

namespace App\Controller;

use App\Entity\Person;
use App\Entity\PersonProfile;
use App\Entity\Profile;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Services\JwtAuth;

class PersonProfileController extends AbstractController
{
  public function index()
  {
    $person_profile = $this->getDoctrine()->getRepository(PersonProfile::class);
    $person_profiles = $person_profile->findBy(array(
      'state' => 1
    ));

    return $this->json([
      'data' => $person_profiles,
    ]);
  }

  public function all()
  {
    $person_profile = $this->getDoctrine()->getRepository(PersonProfile::class);
    $person_profiles = $person_profile->findAll();

    return $this->json([
      'data' => $person_profiles,
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

        $person_id = $json['person_id'];
        $profile_id = $json['profile_id'];

        if (!empty($person_id) && !empty($profile_id)) {
//
          $person_repo = $doctrine->getRepository(Person::class);
          $person = $person_repo->findOneBy(array(
            'id' => $person_id
          ));

          $profile_repo = $doctrine->getRepository(Profile::class);
          $profile = $profile_repo->findOneBy(array(
            'id' => $profile_id
          ));
//
          $person_profile = new PersonProfile();
          $person_profile->setProfile($profile);
          $person_profile->setperson($person);
          $person_profile->setCreatedAt($date);
          $person_profile->setUpdatedAt($date);

          $person_profile_repo = $doctrine->getRepository(PersonProfile::class);
          $isset_person_profile = $person_profile_repo->findBy(array(
            'profile' => $profile_id,
            'person' => $person_id,
          ));

          if (count($isset_person_profile) == 0) {

            $db->persist($person_profile);
            $db->flush();
            $db = $doctrine->getConnection();

            $query = "SELECT * FROM profile p
                    WHERE p.id NOT IN
                    (SELECT p.id FROM profile p
                    INNER JOIN person_profile pp
                    ON p.id = pp.profile_id
                    WHERE pp.person_id = $person_id)";

            $stmt = $db->prepare($query);
            $params = array();
            $stmt->execute($params);
            $result = $stmt->fetchAll();

            $person_profile = $this->getDoctrine()->getRepository(PersonProfile::class);
            $person_profiles = $person_profile->findAll();

            $array = [
              'status' => 'success',
              'message' => 'Persona - Perfil agregados correctamente.',
              'profile' => $result,
              'people' => $person_profiles
            ];
            return $this->json($array);
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Persona - perfil ya existente.';
          }
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'Todos los campos son necesarios.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'Persona - perfil no se ha creado.';
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

        $person_id = $json['person_id'];
        $profile_id = $json['profile_id'];
        $person_profile_id = (!empty($json['person_profile_id'])) ?  $json['person_profile_id'] : null;

        if(!empty($person_id) && !empty($profile_id) && !empty($person_profile_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();

          $person_profile_repo = $doctrine->getRepository(PersonProfile::class);
          $person_profile = $person_profile_repo->findOneBy(array(
            'id' => $person_profile_id,
          ));

          $person_repo = $doctrine->getRepository(Person::class);
          $person = $person_repo->findOneBy(array(
            'id' => $person_id
          ));

          $profile_repo = $doctrine->getRepository(Profile::class);
          $profile = $profile_repo->findOneBy(array(
            'id' => $profile_id
          ));

          $per_pro_repo = $doctrine->getRepository(PersonProfile::class);
          $isset_person_profile = $per_pro_repo->findBy(array(
            'profile' => $profile_id,
            'person' => $person_id,
          ));

          if (count($isset_person_profile) == 0) {
//
            $person_profile->setProfile($profile);
            $person_profile->setperson($person);
            $db->persist($person_profile);
            $db->flush();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';
          }else{
            $status = 'error';
            $code = 200;
            $mensaje = 'Ya esta registrado.';
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

        $person_profile_id = (!empty($json['person_profile_id'])) ?  $json['person_profile_id'] : null;
        if(!empty($person_profile_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();

          $person_profile_repo = $doctrine->getRepository(PersonProfile::class);
          $person_profile = $person_profile_repo->findOneBy(array(
            'id' => $person_profile_id,
          ));

          $person_profile->setState(0);
          $db->persist($person_profile);
          $db->flush();

          $person_profile = $this->getDoctrine()->getRepository(PersonProfile::class);
          $person_profiles = $person_profile->findAll();

          $array = [
            'status' => 'success',
            'message' => 'Datos deshabilitados correctamente.',
            'data' => $person_profiles,
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

        $person_profile_id = (!empty($json['person_profile_id'])) ?  $json['person_profile_id'] : null;
        if(!empty($person_profile_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();

          $person_profile_repo = $doctrine->getRepository(PersonProfile::class);
          $person_profile = $person_profile_repo->findOneBy(array(
            'id' => $person_profile_id,
          ));

          $person_profile->setState(1);
          $db->persist($person_profile);
          $db->flush();

          $person_profile = $this->getDoctrine()->getRepository(PersonProfile::class);
          $person_profiles = $person_profile->findAll();

          $array = [
            'status' => 'success',
            'message' => 'Datos habilitados correctamente.',
            'data' => $person_profiles,
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
}
