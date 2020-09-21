<?php

namespace App\Controller;

use App\Entity\Municipality;
use App\Entity\Nationality;
use App\Entity\Neighborhood;
use App\Entity\Profession;
use App\Entity\Scholarship;
use App\Entity\SiteClass;
use App\Entity\Variable;
use App\Entity\Vehicle;
use App\Entity\WeaponType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\LegalCase;
use App\Services\JwtAuth;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class CaseController extends AbstractController
{
    public function index()
    {
      $case = $this->getDoctrine()->getRepository(LegalCase::class);
      $cases = $case->findBy(array(
        'state' => 1
      ));

      return $this->json($cases, Response::HTTP_OK, [], [
        ObjectNormalizer::IGNORED_ATTRIBUTES => ['legalCase']
      ]);
    }


  public function all()
  {
    $case = $this->getDoctrine()->getRepository(LegalCase::class);
    $cases = $case->findAll();

    return $this->json($cases, Response::HTTP_OK, [], [
      ObjectNormalizer::IGNORED_ATTRIBUTES => ['legalCase']
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

        $victim = $json['victim'];
        $aggressor = $json['aggressor'];
        $direction = $json['direction'];
        $latitude = $json['latitude'];
        $longitude = $json['longitude'];
        $age = $json['age'];
        $civil_status = $json['civilStatus'];
        $gender = $json['gender'];
        $font = $json['font'];
        $event_date = new \DateTime($json['date'], $timezone);
        $time = new \DateTime($json['time'], $timezone);
        $temporary_behavior = $json['temporaryBehavior'];
        $spatial_behavior = $json['spatialBehavior'];
        $vehicle_aggressor_id = $json['vehicleAggressor_name'];
        $vehicle_victim_id = $json['vehicleVictim_name'];
        $profession_id = $json['profession_name'];
        $municipality_id = $json['municipality_name'];
        $weapon_type_id = $json['weaponType_name'];
        $site_class_id = $json['siteClass_name'];
        $neighborhood_id = $json['neighborhood_name'];
        $scholarship_id = $json['scholarship_name'];
        $nationality_id = $json['nationality_name'];
        $variable_id = $json['variable_name'];

        if (!empty($victim) && !empty($vehicle_aggressor_id) &&
            !empty($vehicle_victim_id) && !empty($municipality_id) &&
            !empty($profession_id) && !empty($weapon_type_id) &&
            !empty($aggressor) && !empty($direction) && !empty($latitude) &&
            !empty($longitude) && !empty($age) && !empty($civil_status) &&
            !empty($gender) && !empty($font) && !empty($event_date) &&
            !empty($time) && !empty($temporary_behavior) && !empty($spatial_behavior) &&
            !empty($site_class_id) && !empty($neighborhood_id) && !empty($scholarship_id) &&
            !empty($nationality_id) && !empty($variable_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();

          $case_repo = $doctrine->getRepository(LegalCase::class);

          $vehicle_aggressor_repo = $doctrine->getRepository(Vehicle::class);
          $vehicle_aggressor = $vehicle_aggressor_repo->findOneBy(array(
            'name' => $vehicle_aggressor_id
          ));

          $vehicle_victim_repo = $doctrine->getRepository(Vehicle::class);
          $vehicle_victim = $vehicle_victim_repo->findOneBy(array(
            'name' => $vehicle_victim_id
          ));

          $profession_repo = $doctrine->getRepository(Profession::class);
          $profession = $profession_repo->findOneBy(array(
            'name' => $profession_id
          ));

          $weapon_type_repo = $doctrine->getRepository(WeaponType::class);
          $weapon_type = $weapon_type_repo->findOneBy(array(
            'name' => $weapon_type_id
          ));

          $site_class_repo = $doctrine->getRepository(SiteClass::class);
          $site_class = $site_class_repo->findOneBy(array(
            'name' => $site_class_id
          ));

          $neighborhood_repo = $doctrine->getRepository(Neighborhood::class);
          $neighborhood = $neighborhood_repo->findOneBy(array(
            'name' => $neighborhood_id
          ));

          $scholarship_repo = $doctrine->getRepository(Scholarship::class);
          $scholarship = $scholarship_repo->findOneBy(array(
            'name' => $scholarship_id
          ));

          $nationality_repo = $doctrine->getRepository(Nationality::class);
          $nationality = $nationality_repo->findOneBy(array(
            'name' => $nationality_id
          ));

          $variable_repo = $doctrine->getRepository(Variable::class);
          $variable = $variable_repo->findOneBy(array(
            'name' => $variable_id
          ));

          $municipality_repo = $doctrine->getRepository(Municipality::class);
          $municipality = $municipality_repo->findOneBy(array(
            'name' => $municipality_id
          ));

          $case = new LegalCase();
          $case->setVictim($victim);
          $case->setAggressor($aggressor);
          $case->setAge($age);
          $case->setCivilStatus($civil_status);
          $case->setGender($gender);
          $case->setDirection($direction);
          $case->setDate($event_date);
          $case->setTime($time);
          $case->setLongitude($longitude);
          $case->setLatitude($latitude);
          $case->setFont($font);
          $case->setTemporaryBehavior($temporary_behavior);
          $case->setSpatialBehavior($spatial_behavior);
          $case->setVehicleVictim($vehicle_victim);
          $case->setVehicleAggressor($vehicle_aggressor);
          $case->setProfession($profession);
          $case->setMunicipality($municipality);
          $case->setWeaponType($weapon_type);
          $case->setSiteClass($site_class);
          $case->setNeighborhood($neighborhood);
          $case->setScholarship($scholarship);
          $case->setNationality($nationality);
          $case->setVariable($variable);
          $case->setCreatedAt($date);
          $case->setUpdatedAt($date);

          $db->persist($case);
          $db->flush();

          $cases = $case_repo->findAll();
          $status = 'success';
          $code = 200;
          $mensaje = 'El caso se ha creado correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $cases
          ];

          return $this->json($data, Response::HTTP_OK, [], [
            ObjectNormalizer::IGNORED_ATTRIBUTES => ['legalCase']
          ]);
        } else {

          $status = 'error';
          $code = 200;
          $mensaje = 'Todos los campos son obligatorios.';
        }
      } else {

        $status = 'error';
        $code = 200;
        $mensaje = 'Todos los campos son obligatorios.';
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

        $victim = $json['victim'];
        $aggressor = $json['aggressor'];
        $direction = $json['direction'];
        $latitude = $json['latitude'];
        $longitude = $json['longitude'];
        $age = $json['age'];
        $civil_status = $json['civilStatus'];
        $gender = $json['gender'];
        $font = $json['font'];
        $event_date = new \DateTime($json['date'], $timezone);
        $time = new \DateTime($json['time'], $timezone);
        $temporary_behavior = $json['temporaryBehavior'];
        $spatial_behavior = $json['spatialBehavior'];
        $vehicle_aggressor_id = $json['vehicleAggressor_name'];
        $vehicle_victim_id = $json['vehicleVictim_name'];
        $profession_id = $json['profession_name'];
        $municipality_id = $json['municipality_name'];
        $weapon_type_id = $json['weaponType_name'];
        $site_class_id = $json['siteClass_name'];
        $neighborhood_id = $json['neighborhood_name'];
        $scholarship_id = $json['scholarship_name'];
        $nationality_id = $json['nationality_name'];
        $variable_id = $json['variable_name'];
        $case_id = $json['id'];

        if (!empty($victim) && !empty($vehicle_aggressor_id) &&
          !empty($vehicle_victim_id) && !empty($municipality_id) &&
          !empty($profession_id) && !empty($weapon_type_id) &&
          !empty($aggressor) && !empty($direction) && !empty($latitude) &&
          !empty($longitude) && !empty($age) && !empty($civil_status) &&
          !empty($gender) && !empty($font) && !empty($event_date) &&
          !empty($time) && !empty($temporary_behavior) && !empty($spatial_behavior) &&
          !empty($site_class_id) && !empty($neighborhood_id) && !empty($scholarship_id) &&
          !empty($nationality_id) && !empty($variable_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $case_repo = $doctrine->getRepository(LegalCase::class);
          $case = $case_repo->findOneBy(array(
            'id' => $case_id,
          ));

          $vehicle_aggressor_repo = $doctrine->getRepository(Vehicle::class);
          $vehicle_aggressor = $vehicle_aggressor_repo->findOneBy(array(
            'name' => $vehicle_aggressor_id
          ));

          $vehicle_victim_repo = $doctrine->getRepository(Vehicle::class);
          $vehicle_victim = $vehicle_victim_repo->findOneBy(array(
            'name' => $vehicle_victim_id
          ));

          $profession_repo = $doctrine->getRepository(Profession::class);
          $profession = $profession_repo->findOneBy(array(
            'name' => $profession_id
          ));

          $weapon_type_repo = $doctrine->getRepository(WeaponType::class);
          $weapon_type = $weapon_type_repo->findOneBy(array(
            'name' => $weapon_type_id
          ));

          $site_class_repo = $doctrine->getRepository(SiteClass::class);
          $site_class = $site_class_repo->findOneBy(array(
            'name' => $site_class_id
          ));

          $neighborhood_repo = $doctrine->getRepository(Neighborhood::class);
          $neighborhood = $neighborhood_repo->findOneBy(array(
            'name' => $neighborhood_id
          ));

          $scholarship_repo = $doctrine->getRepository(Scholarship::class);
          $scholarship = $scholarship_repo->findOneBy(array(
            'name' => $scholarship_id
          ));

          $nationality_repo = $doctrine->getRepository(Nationality::class);
          $nationality = $nationality_repo->findOneBy(array(
            'name' => $nationality_id
          ));

          $variable_repo = $doctrine->getRepository(Variable::class);
          $variable = $variable_repo->findOneBy(array(
            'name' => $variable_id
          ));

          $municipality_repo = $doctrine->getRepository(Municipality::class);
          $municipality = $municipality_repo->findOneBy(array(
            'name' => $municipality_id
          ));

            $case->setVictim($victim);
            $case->setAggressor($aggressor);
            $case->setAge($age);
            $case->setCivilStatus($civil_status);
            $case->setGender($gender);
            $case->setDirection($direction);
            $case->setDate($event_date);
            $case->setTime($time);
            $case->setLongitude($longitude);
            $case->setLatitude($latitude);
            $case->setFont($font);
            $case->setTemporaryBehavior($temporary_behavior);
            $case->setSpatialBehavior($spatial_behavior);
            $case->setVehicleVictim($vehicle_victim);
            $case->setVehicleAggressor($vehicle_aggressor);
            $case->setProfession($profession);
            $case->setMunicipality($municipality);
            $case->setWeaponType($weapon_type);
            $case->setSiteClass($site_class);
            $case->setNeighborhood($neighborhood);
            $case->setScholarship($scholarship);
            $case->setNationality($nationality);
            $case->setVariable($variable);
            $case->setUpdatedAt($date);

            $db->persist($case);
            $db->flush();

            $cases = $case_repo->findAll();
            $status = 'success';
            $code = 200;
            $mensaje = 'Datos modificados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $cases
          ];

          return $this->json($data, Response::HTTP_OK, [], [
            ObjectNormalizer::IGNORED_ATTRIBUTES => ['legalCase']
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

        $case_id = $json['case_id'];

        if (!empty($case_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $case_repo = $doctrine->getRepository(LegalCase::class);
          $case = $case_repo->findOneBy(array(
            'id' => $case_id,
          ));

          $case->setState(0);
          $case->setUpdatedAt($date);

          $db->persist($case);
          $db->flush();

          $cases = $case_repo->findAll();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos deshabilitados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $cases
          ];

          return $this->json($data, Response::HTTP_OK, [], [
            ObjectNormalizer::IGNORED_ATTRIBUTES => ['legalCase']
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

        $case_id = $json['case_id'];

        if (!empty($case_id)) {

          $doctrine = $this->getDoctrine();
          $db = $doctrine->getManager();
          $case_repo = $doctrine->getRepository(LegalCase::class);
          $case = $case_repo->findOneBy(array(
            'id' => $case_id,
          ));

          $case->setState(1);
          $case->setUpdatedAt($date);

          $db->persist($case);
          $db->flush();

          $cases = $case_repo->findAll();
          $status = 'success';
          $code = 200;
          $mensaje = 'Datos habilitados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $cases
          ];

          return $this->json($data, Response::HTTP_OK, [], [
            ObjectNormalizer::IGNORED_ATTRIBUTES => ['legalCase']
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

  public function theftAnalysi(Request $request){
    $json = $request->getContent();
    $json = json_decode($json, true);

    if($json != null){

      $variable = (!empty($json['variable'])) ? $json['variable'] : null;
      $table = (!empty($json['table'])) ? $json['table'] : null;
      $column = (!empty($json['column'])) ? $json['column'] : null;
      $date = (!empty($json['date'])) ? $json['date'] : null;
      $current = (!empty($json['current'])) ? $json['current'] : null;
      $map = (!empty($json['map'])) ? $json['map'] : null;

      $doctrine = $this->getDoctrine();
      $db = $doctrine->getConnection();

      if (!empty($variable) && !empty($table) && empty($column)) {

        $attribute = $table.'_id';
        $query = "SELECT p.name AS name, count(lc.id) AS quantity FROM $table p
                  INNER JOIN legal_case lc
                  ON p.id = lc.$attribute
                  WHERE lc.variable_id = $variable AND lc.state = '1'
                  GROUP BY p.id;";

        $stmt = $db->prepare($query);
        $params = array();
        $stmt->execute($params);
        $result = $stmt->fetchAll();

        $count = count($result);
        if ($count > 0) {

          $data = [
            'number' => array_column($result, 'quantity'),
            'label' => array_column($result, 'name')
          ];

          return $this->json($data);
        } else {

          $status = 'success';
          $code = 200;
          $mensaje = 'No se han encontrado datos para su consulta.';
        }
      }elseif (!empty($variable) && !empty($column) && empty($table)){

        $query = "SELECT $column AS name, count(id) AS quantity FROM legal_case
                  WHERE variable_id = $variable  AND state = '1'
                  GROUP BY $column;";

        $stmt = $db->prepare($query);
        $params = array();
        $stmt->execute($params);
        $result = $stmt->fetchAll();

        $count = count($result);
        if ($count > 0) {

          $data = [
            'number' => array_column($result, 'quantity'),
            'label' => array_column($result, 'name'),
//            'date' => array_column($result, 'label'),
          ];

          return $this->json($data);
        } else {

          $status = 'success';
          $code = 200;
          $mensaje = 'No se han encontrado datos para su consulta.';
        }
      }elseif(!empty($variable) && empty($column) && empty($table)){

        $query = "SELECT
                  CASE WHEN (age < 18) THEN 'Menores de 18 años' ELSE
                    CASE WHEN (age BETWEEN 18 AND 30) THEN 'De 18 a 30 años' ELSE
                      CASE WHEN (age BETWEEN 30 AND 45) THEN 'De 30 a 45 años' ELSE
                        CASE WHEN (age >= 45) THEN 'De 45 años o más'
                        END
                      END
                    END
                  END age_range,
                  count(id) AS quantity,
                  (SELECT COUNT(legal_case.id)*100/COUNT(lc.id)
                  FROM legal_case lc
                  ) AS percentage
                  FROM legal_case
                  WHERE variable_id = $variable  AND lc.state = '1'
                  GROUP BY age_range DESC;";

        $stmt = $db->prepare($query);
        $params = array();
        $stmt->execute($params);
        $result = $stmt->fetchAll();

        $count = count($result);
        if ($count > 0) {

          return $this->json($result);
        } else {

          $status = 'success';
          $code = 200;
          $mensaje = 'No se han encontrado datos para su consulta.';
        }
      }elseif(empty($variable) && empty($column) && !empty($table)){

        $attribute = $table.'_id';
        $query = "SELECT p.name AS name, count(lc.id) AS quantity FROM $table p
                  INNER JOIN legal_case lc
                  ON p.id = lc.$attribute
                  WHERE lc.state = '1'
                  GROUP BY p.id;";

        $stmt = $db->prepare($query);
        $params = array();
        $stmt->execute($params);
        $result = $stmt->fetchAll();

        $count = count($result);
        if ($count > 0) {
          return $this->json($result);
        } else {

          $status = 'success';
          $code = 200;
          $mensaje = 'No se han encontrado datos para su consulta.';
        }
      }elseif(empty($variable) && empty($column) && empty($table) && !empty($date)){

        $timezone = new \DateTimeZone('America/Bogota');
        $dateCurrent = new \DateTime('now', $timezone);

        $dateInt = strtotime($dateCurrent->format("Y/m/d"));

        if(!empty($current) && $current == 'actual'){
          if($date == 'mes'){

            $year = date("Y", $dateInt);
            $month = date("m", $dateInt);

            $query = "SELECT COUNT(YEAR(date)) AS quantity FROM legal_case
                      where MONTH(DATE) = $month AND YEAR(DATE) = $year  AND state = '1'
                      GROUP BY MONTH(date)";
          }else if($date == 'año'){

            $year = date("Y", $dateInt);

            $query = "SELECT COUNT(YEAR(date)) AS quantity FROM legal_case
                    where YEAR(date) = $year  AND state = '1'
                    GROUP BY YEAR(date);";
          }
        }else{
          if($date == 'mes'){
            $query = "SELECT COUNT(YEAR(date)) AS quantity, MONTHNAME(date) as name FROM legal_case
                        where state = '1'
                      GROUP BY MONTH(date);";
          }else if($date == 'año'){
            $query = "SELECT COUNT(YEAR(date)) AS quantity, YEAR(date) AS name FROM legal_case
                      where state = '1'
                      GROUP BY YEAR(date);";
          }
        }

        $db->query("SET lc_time_names = 'es_ES'");
        $stmt = $db->prepare($query);
        $params = array();
        $stmt->execute($params);
        $result = $stmt->fetchAll();

        $count = count($result);
        if ($count > 0) {
          $data = [
            'number' => array_column($result, 'quantity'),
            'label' => array_column($result, 'name'),
          ];
          return $this->json($data);
        } else {

          $status = 'success';
          $code = 200;
          $mensaje = 'No se han encontrado datos para su consulta.';
        }
      }elseif(empty($variable) && empty($column) && empty($table) && empty($date) && !empty($map)) {

        $query = "SELECT latitude, longitude FROM legal_case
                      where state = '1'";

        $stmt = $db->prepare($query);
        $params = array();
        $stmt->execute($params);
        $result = $stmt->fetchAll();

        $count = count($result);
        if ($count > 0) {

          $data = [
            'features' => [],
          ];

          foreach ($result as $item) {
            $temp = [
              'coordinates' => [$item['latitude'], $item['longitude']]
            ];
            array_push($data['features'], $temp);
          }

          return $this->json($data);
        } else {

          $status = 'success';
          $code = 200;
          $mensaje = 'No se han encontrado datos para su consulta.';
        }
      }else{
        $status = 'error';
        $code = 200;
        $mensaje = 'No se han encontrado datos para su consulta.';
      }

      $data = [
        'status' => $status,
        'code' => $code,
        'message' => $mensaje,
      ];

      return $this->json($data);
    }
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

        $case_id = $json['case_id'];

        if (!empty($case_id)) {

          $doctrine = $this->getDoctrine();
          $case_repo = $doctrine->getRepository(LegalCase::class);
          $case = $case_repo->findOneBy(array(
            'id' => $case_id,
          ));

          $status = 'success';
          $code = 200;
          $mensaje = 'Datos cargados correctamente.';

          $data = [
            'status' => $status,
            'code' => $code,
            'message' => $mensaje,
            'data' => $case
          ];

          return $this->json($data, Response::HTTP_OK, [], [
            ObjectNormalizer::IGNORED_ATTRIBUTES => ['legalCase']
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
