package ng.campusnig.com.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Universite.
 */
@Entity
@Table(name = "universite")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Universite implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "libelle")
    private String libelle;

    @OneToMany(mappedBy = "universite")
    @JsonIgnoreProperties(value = { "departements", "universite" }, allowSetters = true)
    private Set<Faculte> facultes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Universite id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public Universite libelle(String libelle) {
        this.setLibelle(libelle);
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public Set<Faculte> getFacultes() {
        return this.facultes;
    }

    public void setFacultes(Set<Faculte> facultes) {
        if (this.facultes != null) {
            this.facultes.forEach(i -> i.setUniversite(null));
        }
        if (facultes != null) {
            facultes.forEach(i -> i.setUniversite(this));
        }
        this.facultes = facultes;
    }

    public Universite facultes(Set<Faculte> facultes) {
        this.setFacultes(facultes);
        return this;
    }

    public Universite addFaculte(Faculte faculte) {
        this.facultes.add(faculte);
        faculte.setUniversite(this);
        return this;
    }

    public Universite removeFaculte(Faculte faculte) {
        this.facultes.remove(faculte);
        faculte.setUniversite(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Universite)) {
            return false;
        }
        return id != null && id.equals(((Universite) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Universite{" +
            "id=" + getId() +
            ", libelle='" + getLibelle() + "'" +
            "}";
    }
}
