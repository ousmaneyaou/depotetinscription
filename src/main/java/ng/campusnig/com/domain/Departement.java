package ng.campusnig.com.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Departement.
 */
@Entity
@Table(name = "departement")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Departement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "libelle")
    private String libelle;

    @OneToMany(mappedBy = "departement")
    @JsonIgnoreProperties(value = { "departement", "dossier" }, allowSetters = true)
    private Set<Niveau> niveaus = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "departements", "universite" }, allowSetters = true)
    private Faculte faculte;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Departement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public Departement libelle(String libelle) {
        this.setLibelle(libelle);
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public Set<Niveau> getNiveaus() {
        return this.niveaus;
    }

    public void setNiveaus(Set<Niveau> niveaus) {
        if (this.niveaus != null) {
            this.niveaus.forEach(i -> i.setDepartement(null));
        }
        if (niveaus != null) {
            niveaus.forEach(i -> i.setDepartement(this));
        }
        this.niveaus = niveaus;
    }

    public Departement niveaus(Set<Niveau> niveaus) {
        this.setNiveaus(niveaus);
        return this;
    }

    public Departement addNiveau(Niveau niveau) {
        this.niveaus.add(niveau);
        niveau.setDepartement(this);
        return this;
    }

    public Departement removeNiveau(Niveau niveau) {
        this.niveaus.remove(niveau);
        niveau.setDepartement(null);
        return this;
    }

    public Faculte getFaculte() {
        return this.faculte;
    }

    public void setFaculte(Faculte faculte) {
        this.faculte = faculte;
    }

    public Departement faculte(Faculte faculte) {
        this.setFaculte(faculte);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Departement)) {
            return false;
        }
        return id != null && id.equals(((Departement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Departement{" +
            "id=" + getId() +
            ", libelle='" + getLibelle() + "'" +
            "}";
    }
}
