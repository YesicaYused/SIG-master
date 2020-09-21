<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * LegalCase
 *
 * @ORM\Table(name="legal_case", indexes={@ORM\Index(name="FK_case_profession", columns={"profession_id"}), @ORM\Index(name="FK_case_site_class", columns={"site_class_id"}), @ORM\Index(name="FK_case_nationality", columns={"nationality_id"}), @ORM\Index(name="FK_case_vehicle", columns={"vehicle_aggressor_id"}), @ORM\Index(name="FK_case_municipality", columns={"municipality_id"}), @ORM\Index(name="FK_case_neighborhood", columns={"neighborhood_id"}), @ORM\Index(name="FK_case_variable", columns={"variable_id"}), @ORM\Index(name="FK_case_weapon_type", columns={"weapon_type_id"}), @ORM\Index(name="FK_case_scholarship", columns={"scholarship_id"}), @ORM\Index(name="FK_case_vehicle_2", columns={"vehicle_victim_id"})})
 * @ORM\Entity
 */
class LegalCase
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="victim", type="text", length=65535, nullable=false)
     */
    private $victim;

    /**
     * @var string
     *
     * @ORM\Column(name="aggressor", type="text", length=65535, nullable=false)
     */
    private $aggressor;

    /**
     * @var string
     *
     * @ORM\Column(name="direction", type="text", length=65535, nullable=false)
     */
    private $direction;

    /**
     * @var string
     *
     * @ORM\Column(name="latitude", type="string", length=100, nullable=false)
     */
    private $latitude;

    /**
     * @var string
     *
     * @ORM\Column(name="longitude", type="string", length=100, nullable=false)
     */
    private $longitude;

    /**
     * @var string
     *
     * @ORM\Column(name="age", type="string", length=5, nullable=false)
     */
    private $age;

    /**
     * @var string
     *
     * @ORM\Column(name="civil_status", type="string", length=20, nullable=false)
     */
    private $civilStatus;

    /**
     * @var string
     *
     * @ORM\Column(name="gender", type="string", length=20, nullable=false)
     */
    private $gender;

    /**
     * @var string
     *
     * @ORM\Column(name="font", type="text", length=65535, nullable=false)
     */
    private $font;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="date", nullable=false)
     */
    private $date;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="time", type="time", nullable=false)
     */
    private $time;

    /**
     * @var string
     *
     * @ORM\Column(name="temporary_behavior", type="text", length=65535, nullable=false)
     */
    private $temporaryBehavior;

    /**
     * @var string
     *
     * @ORM\Column(name="spatial_behavior", type="text", length=65535, nullable=false)
     */
    private $spatialBehavior;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=false, options={"default"="CURRENT_TIMESTAMP"})
     */
    private $createdAt = 'CURRENT_TIMESTAMP';

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime", nullable=false, options={"default"="CURRENT_TIMESTAMP"})
     */
    private $updatedAt = 'CURRENT_TIMESTAMP';

    /**
     * @var string
     *
     * @ORM\Column(name="state", type="string", length=1, nullable=false, options={"default"="1"})
     */
    private $state = '1';

    /**
     * @var \Municipality
     *
     * @ORM\ManyToOne(targetEntity="Municipality")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="municipality_id", referencedColumnName="id")
     * })
     */
    private $municipality;

    /**
     * @var \Nationality
     *
     * @ORM\ManyToOne(targetEntity="Nationality")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="nationality_id", referencedColumnName="id")
     * })
     */
    private $nationality;

    /**
     * @var \Neighborhood
     *
     * @ORM\ManyToOne(targetEntity="Neighborhood")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="neighborhood_id", referencedColumnName="id")
     * })
     */
    private $neighborhood;

    /**
     * @var \Profession
     *
     * @ORM\ManyToOne(targetEntity="Profession")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="profession_id", referencedColumnName="id")
     * })
     */
    private $profession;

    /**
     * @var \Scholarship
     *
     * @ORM\ManyToOne(targetEntity="Scholarship")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="scholarship_id", referencedColumnName="id")
     * })
     */
    private $scholarship;

    /**
     * @var \SiteClass
     *
     * @ORM\ManyToOne(targetEntity="SiteClass")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="site_class_id", referencedColumnName="id")
     * })
     */
    private $siteClass;

    /**
     * @var \Variable
     *
     * @ORM\ManyToOne(targetEntity="Variable")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="variable_id", referencedColumnName="id")
     * })
     */
    private $variable;

    /**
     * @var \Vehicle
     *
     * @ORM\ManyToOne(targetEntity="Vehicle")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="vehicle_aggressor_id", referencedColumnName="id")
     * })
     */
    private $vehicleAggressor;

    /**
     * @var \Vehicle
     *
     * @ORM\ManyToOne(targetEntity="Vehicle")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="vehicle_victim_id", referencedColumnName="id")
     * })
     */
    private $vehicleVictim;

    /**
     * @var \WeaponType
     *
     * @ORM\ManyToOne(targetEntity="WeaponType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="weapon_type_id", referencedColumnName="id")
     * })
     */
    private $weaponType;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getVictim(): ?string
    {
        return $this->victim;
    }

    public function setVictim(string $victim): self
    {
        $this->victim = $victim;

        return $this;
    }

    public function getAggressor(): ?string
    {
        return $this->aggressor;
    }

    public function setAggressor(string $aggressor): self
    {
        $this->aggressor = $aggressor;

        return $this;
    }

    public function getDirection(): ?string
    {
        return $this->direction;
    }

    public function setDirection(string $direction): self
    {
        $this->direction = $direction;

        return $this;
    }

    public function getLatitude(): ?string
    {
        return $this->latitude;
    }

    public function setLatitude(string $latitude): self
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getLongitude(): ?string
    {
        return $this->longitude;
    }

    public function setLongitude(string $longitude): self
    {
        $this->longitude = $longitude;

        return $this;
    }

    public function getAge(): ?string
    {
        return $this->age;
    }

    public function setAge(string $age): self
    {
        $this->age = $age;

        return $this;
    }

    public function getCivilStatus(): ?string
    {
        return $this->civilStatus;
    }

    public function setCivilStatus(string $civilStatus): self
    {
        $this->civilStatus = $civilStatus;

        return $this;
    }

    public function getGender(): ?string
    {
        return $this->gender;
    }

    public function setGender(string $gender): self
    {
        $this->gender = $gender;

        return $this;
    }

    public function getFont(): ?string
    {
        return $this->font;
    }

    public function setFont(string $font): self
    {
        $this->font = $font;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getTime(): ?\DateTimeInterface
    {
        return $this->time;
    }

    public function setTime(\DateTimeInterface $time): self
    {
        $this->time = $time;

        return $this;
    }

    public function getTemporaryBehavior(): ?string
    {
        return $this->temporaryBehavior;
    }

    public function setTemporaryBehavior(string $temporaryBehavior): self
    {
        $this->temporaryBehavior = $temporaryBehavior;

        return $this;
    }

    public function getSpatialBehavior(): ?string
    {
        return $this->spatialBehavior;
    }

    public function setSpatialBehavior(string $spatialBehavior): self
    {
        $this->spatialBehavior = $spatialBehavior;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(string $state): self
    {
        $this->state = $state;

        return $this;
    }

    public function getMunicipality(): ?Municipality
    {
        return $this->municipality;
    }

    public function setMunicipality(?Municipality $municipality): self
    {
        $this->municipality = $municipality;

        return $this;
    }

    public function getNationality(): ?Nationality
    {
        return $this->nationality;
    }

    public function setNationality(?Nationality $nationality): self
    {
        $this->nationality = $nationality;

        return $this;
    }

    public function getNeighborhood(): ?Neighborhood
    {
        return $this->neighborhood;
    }

    public function setNeighborhood(?Neighborhood $neighborhood): self
    {
        $this->neighborhood = $neighborhood;

        return $this;
    }

    public function getProfession(): ?Profession
    {
        return $this->profession;
    }

    public function setProfession(?Profession $profession): self
    {
        $this->profession = $profession;

        return $this;
    }

    public function getScholarship(): ?Scholarship
    {
        return $this->scholarship;
    }

    public function setScholarship(?Scholarship $scholarship): self
    {
        $this->scholarship = $scholarship;

        return $this;
    }

    public function getSiteClass(): ?SiteClass
    {
        return $this->siteClass;
    }

    public function setSiteClass(?SiteClass $siteClass): self
    {
        $this->siteClass = $siteClass;

        return $this;
    }

    public function getVariable(): ?Variable
    {
        return $this->variable;
    }

    public function setVariable(?Variable $variable): self
    {
        $this->variable = $variable;

        return $this;
    }

    public function getVehicleAggressor(): ?Vehicle
    {
        return $this->vehicleAggressor;
    }

    public function setVehicleAggressor(?Vehicle $vehicleAggressor): self
    {
        $this->vehicleAggressor = $vehicleAggressor;

        return $this;
    }

    public function getVehicleVictim(): ?Vehicle
    {
        return $this->vehicleVictim;
    }

    public function setVehicleVictim(?Vehicle $vehicleVictim): self
    {
        $this->vehicleVictim = $vehicleVictim;

        return $this;
    }

    public function getWeaponType(): ?WeaponType
    {
        return $this->weaponType;
    }

    public function setWeaponType(?WeaponType $weaponType): self
    {
        $this->weaponType = $weaponType;

        return $this;
    }


}
