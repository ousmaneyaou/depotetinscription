package ng.campusnig.com.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Campagne.
 */
@Entity
@Table(name = "campagne")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Campagne implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "intitule")
    private String intitule;

    @Column(name = "date_debut")
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    @OneToMany(mappedBy = "campagne")
    @JsonIgnoreProperties(value = { "campagne" }, allowSetters = true)
    private Set<AnneeScolaire> anneeScolaires = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "niveaus", "campagnes", "depots" }, allowSetters = true)
    private Dossier dossier;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Campagne id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIntitule() {
        return this.intitule;
    }

    public Campagne intitule(String intitule) {
        this.setIntitule(intitule);
        return this;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

    public LocalDate getDateDebut() {
        return this.dateDebut;
    }

    public Campagne dateDebut(LocalDate dateDebut) {
        this.setDateDebut(dateDebut);
        return this;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return this.dateFin;
    }

    public Campagne dateFin(LocalDate dateFin) {
        this.setDateFin(dateFin);
        return this;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public Set<AnneeScolaire> getAnneeScolaires() {
        return this.anneeScolaires;
    }

    public void setAnneeScolaires(Set<AnneeScolaire> anneeScolaires) {
        if (this.anneeScolaires != null) {
            this.anneeScolaires.forEach(i -> i.setCampagne(null));
        }
        if (anneeScolaires != null) {
            anneeScolaires.forEach(i -> i.setCampagne(this));
        }
        this.anneeScolaires = anneeScolaires;
    }

    public Campagne anneeScolaires(Set<AnneeScolaire> anneeScolaires) {
        this.setAnneeScolaires(anneeScolaires);
        return this;
    }

    public Campagne addAnneeScolaire(AnneeScolaire anneeScolaire) {
        this.anneeScolaires.add(anneeScolaire);
        anneeScolaire.setCampagne(this);
        return this;
    }

    public Campagne removeAnneeScolaire(AnneeScolaire anneeScolaire) {
        this.anneeScolaires.remove(anneeScolaire);
        anneeScolaire.setCampagne(null);
        return this;
    }

    public Dossier getDossier() {
        return this.dossier;
    }

    public void setDossier(Dossier dossier) {
        this.dossier = dossier;
    }

    public Campagne dossier(Dossier dossier) {
        this.setDossier(dossier);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Campagne)) {
            return false;
        }
        return id != null && id.equals(((Campagne) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Campagne{" +
            "id=" + getId() +
            ", intitule='" + getIntitule() + "'" +
            ", dateDebut='" + getDateDebut() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            "}";
    }
}
