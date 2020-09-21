<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Icon
 *
 * @ORM\Table(name="icon", uniqueConstraints={@ORM\UniqueConstraint(name="name", columns={"name"})}, indexes={@ORM\Index(name="FK_icon_icon_type", columns={"icon_type_id"}), @ORM\Index(name="FK_icon_icon_theme", columns={"icon_theme_id"})})
 * @ORM\Entity
 */
class Icon
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
     * @ORM\Column(name="name", type="string", length=100, nullable=false)
     */
    private $name;

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
     * @var \IconTheme
     *
     * @ORM\ManyToOne(targetEntity="IconTheme")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="icon_theme_id", referencedColumnName="id")
     * })
     */
    private $iconTheme;

    /**
     * @var \IconType
     *
     * @ORM\ManyToOne(targetEntity="IconType")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="icon_type_id", referencedColumnName="id")
     * })
     */
    private $iconType;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

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

    public function getIconTheme(): ?IconTheme
    {
        return $this->iconTheme;
    }

    public function setIconTheme(?IconTheme $iconTheme): self
    {
        $this->iconTheme = $iconTheme;

        return $this;
    }

    public function getIconType(): ?IconType
    {
        return $this->iconType;
    }

    public function setIconType(?IconType $iconType): self
    {
        $this->iconType = $iconType;

        return $this;
    }


}
