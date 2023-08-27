package ng.campusnig.com.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Faculte.
 */
@Entity
@Table(name = "faculte")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Faculte implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "libelle")
    private String libelle;

    @OneToMany(mappedBy = "faculte")
    @JsonIgnoreProperties(value = { "niveaus", "faculte" }, allowSetters = true)
    private Set<Departement> departements = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "facultes" }, allowSetters = true)
    private Universite universite;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Faculte id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public Faculte libelle(String libelle) {
        this.setLibelle(libelle);
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public Set<Departement> getDepartements() {
        return this.departements;
    }

    public void setDepartements(Set<Departement> departements) {
        if (this.departements != null) {
            this.departements.forEach(i -> i.setFaculte(null));
        }
        if (departements != null) {
            departements.forEach(i -> i.setFaculte(this));
        }
        this.departements = departements;
    }

    public Faculte departements(Set<Departement> departements) {
        this.setDepartements(departements);
        return this;
    }

    public Faculte addDepartement(Departement departement) {
        this.departements.add(departement);
        departement.setFaculte(this);
        return this;
    }

    public Faculte removeDepartement(Departement departement) {
        this.departements.remove(departement);
        departement.setFaculte(null);
        return this;
    }

    public Universite getUniversite() {
        return this.universite;
    }

    public void setUniversite(Universite universite) {
        this.universite = universite;
    }

    public Faculte universite(Universite universite) {
        this.setUniversite(universite);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Faculte)) {
            return false;
        }
        return id != null && id.equals(((Faculte) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Faculte{" +
            "id=" + getId() +
            ", libelle='" + getLibelle() + "'" +
            "}";
    }
}
