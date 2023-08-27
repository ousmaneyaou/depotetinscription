package ng.campusnig.com.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import ng.campusnig.com.domain.enumeration.EnumSexe;

/**
 * A Bachelier.
 */
@Entity
@Table(name = "bachelier")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Bachelier implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "sexe")
    private EnumSexe sexe;

    @Column(name = "date_naissance")
    private LocalDate dateNaissance;

    @Column(name = "lieu_naissance")
    private String lieuNaissance;

    @Column(name = "nationalite")
    private String nationalite;

    @Column(name = "telephone")
    private String telephone;

    @Column(name = "numero_table")
    private String numeroTable;

    @Column(name = "serie")
    private String serie;

    @Column(name = "diplome")
    private String diplome;

    @Column(name = "numero_telephone_1")
    private String numeroTelephone1;

    @Column(name = "annee_obtention")
    private String anneeObtention;

    @Column(name = "lieu_obtention")
    private String lieuObtention;

    @Column(name = "mention")
    private String mention;

    @Column(name = "choix_1")
    private String choix1;

    @Column(name = "choix_2")
    private String choix2;

    @Column(name = "choix_3")
    private String choix3;

    @Lob
    @Column(name = "photo")
    private byte[] photo;

    @Column(name = "photo_content_type")
    private String photoContentType;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Bachelier id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EnumSexe getSexe() {
        return this.sexe;
    }

    public Bachelier sexe(EnumSexe sexe) {
        this.setSexe(sexe);
        return this;
    }

    public void setSexe(EnumSexe sexe) {
        this.sexe = sexe;
    }

    public LocalDate getDateNaissance() {
        return this.dateNaissance;
    }

    public Bachelier dateNaissance(LocalDate dateNaissance) {
        this.setDateNaissance(dateNaissance);
        return this;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getLieuNaissance() {
        return this.lieuNaissance;
    }

    public Bachelier lieuNaissance(String lieuNaissance) {
        this.setLieuNaissance(lieuNaissance);
        return this;
    }

    public void setLieuNaissance(String lieuNaissance) {
        this.lieuNaissance = lieuNaissance;
    }

    public String getNationalite() {
        return this.nationalite;
    }

    public Bachelier nationalite(String nationalite) {
        this.setNationalite(nationalite);
        return this;
    }

    public void setNationalite(String nationalite) {
        this.nationalite = nationalite;
    }

    public String getTelephone() {
        return this.telephone;
    }

    public Bachelier telephone(String telephone) {
        this.setTelephone(telephone);
        return this;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getNumeroTable() {
        return this.numeroTable;
    }

    public Bachelier numeroTable(String numeroTable) {
        this.setNumeroTable(numeroTable);
        return this;
    }

    public void setNumeroTable(String numeroTable) {
        this.numeroTable = numeroTable;
    }

    public String getSerie() {
        return this.serie;
    }

    public Bachelier serie(String serie) {
        this.setSerie(serie);
        return this;
    }

    public void setSerie(String serie) {
        this.serie = serie;
    }

    public String getDiplome() {
        return this.diplome;
    }

    public Bachelier diplome(String diplome) {
        this.setDiplome(diplome);
        return this;
    }

    public void setDiplome(String diplome) {
        this.diplome = diplome;
    }

    public String getNumeroTelephone1() {
        return this.numeroTelephone1;
    }

    public Bachelier numeroTelephone1(String numeroTelephone1) {
        this.setNumeroTelephone1(numeroTelephone1);
        return this;
    }

    public void setNumeroTelephone1(String numeroTelephone1) {
        this.numeroTelephone1 = numeroTelephone1;
    }

    public String getAnneeObtention() {
        return this.anneeObtention;
    }

    public Bachelier anneeObtention(String anneeObtention) {
        this.setAnneeObtention(anneeObtention);
        return this;
    }

    public void setAnneeObtention(String anneeObtention) {
        this.anneeObtention = anneeObtention;
    }

    public String getLieuObtention() {
        return this.lieuObtention;
    }

    public Bachelier lieuObtention(String lieuObtention) {
        this.setLieuObtention(lieuObtention);
        return this;
    }

    public void setLieuObtention(String lieuObtention) {
        this.lieuObtention = lieuObtention;
    }

    public String getMention() {
        return this.mention;
    }

    public Bachelier mention(String mention) {
        this.setMention(mention);
        return this;
    }

    public void setMention(String mention) {
        this.mention = mention;
    }

    public String getChoix1() {
        return this.choix1;
    }

    public Bachelier choix1(String choix1) {
        this.setChoix1(choix1);
        return this;
    }

    public void setChoix1(String choix1) {
        this.choix1 = choix1;
    }

    public String getChoix2() {
        return this.choix2;
    }

    public Bachelier choix2(String choix2) {
        this.setChoix2(choix2);
        return this;
    }

    public void setChoix2(String choix2) {
        this.choix2 = choix2;
    }

    public String getChoix3() {
        return this.choix3;
    }

    public Bachelier choix3(String choix3) {
        this.setChoix3(choix3);
        return this;
    }

    public void setChoix3(String choix3) {
        this.choix3 = choix3;
    }

    public byte[] getPhoto() {
        return this.photo;
    }

    public Bachelier photo(byte[] photo) {
        this.setPhoto(photo);
        return this;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getPhotoContentType() {
        return this.photoContentType;
    }

    public Bachelier photoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
        return this;
    }

    public void setPhotoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Bachelier user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Bachelier)) {
            return false;
        }
        return id != null && id.equals(((Bachelier) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Bachelier{" +
            "id=" + getId() +
            ", sexe='" + getSexe() + "'" +
            ", dateNaissance='" + getDateNaissance() + "'" +
            ", lieuNaissance='" + getLieuNaissance() + "'" +
            ", nationalite='" + getNationalite() + "'" +
            ", telephone='" + getTelephone() + "'" +
            ", numeroTable='" + getNumeroTable() + "'" +
            ", serie='" + getSerie() + "'" +
            ", diplome='" + getDiplome() + "'" +
            ", numeroTelephone1='" + getNumeroTelephone1() + "'" +
            ", anneeObtention='" + getAnneeObtention() + "'" +
            ", lieuObtention='" + getLieuObtention() + "'" +
            ", mention='" + getMention() + "'" +
            ", choix1='" + getChoix1() + "'" +
            ", choix2='" + getChoix2() + "'" +
            ", choix3='" + getChoix3() + "'" +
            ", photo='" + getPhoto() + "'" +
            ", photoContentType='" + getPhotoContentType() + "'" +
            "}";
    }
}
