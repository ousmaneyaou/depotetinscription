package ng.campusnig.com.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Dossier.
 */
@Entity
@Table(name = "dossier")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Dossier implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "valider")
    private Boolean valider;

    @OneToMany(mappedBy = "dossier")
    @JsonIgnoreProperties(value = { "departement", "dossier" }, allowSetters = true)
    private Set<Niveau> niveaus = new HashSet<>();

    @OneToMany(mappedBy = "dossier")
    @JsonIgnoreProperties(value = { "anneeScolaires", "dossier" }, allowSetters = true)
    private Set<Campagne> campagnes = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_dossier__depot",
        joinColumns = @JoinColumn(name = "dossier_id"),
        inverseJoinColumns = @JoinColumn(name = "depot_id")
    )
    @JsonIgnoreProperties(value = { "inscriptions", "dossiers" }, allowSetters = true)
    private Set<Depot> depots = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Dossier id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getValider() {
        return this.valider;
    }

    public Dossier valider(Boolean valider) {
        this.setValider(valider);
        return this;
    }

    public void setValider(Boolean valider) {
        this.valider = valider;
    }

    public Set<Niveau> getNiveaus() {
        return this.niveaus;
    }

    public void setNiveaus(Set<Niveau> niveaus) {
        if (this.niveaus != null) {
            this.niveaus.forEach(i -> i.setDossier(null));
        }
        if (niveaus != null) {
            niveaus.forEach(i -> i.setDossier(this));
        }
        this.niveaus = niveaus;
    }

    public Dossier niveaus(Set<Niveau> niveaus) {
        this.setNiveaus(niveaus);
        return this;
    }

    public Dossier addNiveau(Niveau niveau) {
        this.niveaus.add(niveau);
        niveau.setDossier(this);
        return this;
    }

    public Dossier removeNiveau(Niveau niveau) {
        this.niveaus.remove(niveau);
        niveau.setDossier(null);
        return this;
    }

    public Set<Campagne> getCampagnes() {
        return this.campagnes;
    }

    public void setCampagnes(Set<Campagne> campagnes) {
        if (this.campagnes != null) {
            this.campagnes.forEach(i -> i.setDossier(null));
        }
        if (campagnes != null) {
            campagnes.forEach(i -> i.setDossier(this));
        }
        this.campagnes = campagnes;
    }

    public Dossier campagnes(Set<Campagne> campagnes) {
        this.setCampagnes(campagnes);
        return this;
    }

    public Dossier addCampagne(Campagne campagne) {
        this.campagnes.add(campagne);
        campagne.setDossier(this);
        return this;
    }

    public Dossier removeCampagne(Campagne campagne) {
        this.campagnes.remove(campagne);
        campagne.setDossier(null);
        return this;
    }

    public Set<Depot> getDepots() {
        return this.depots;
    }

    public void setDepots(Set<Depot> depots) {
        this.depots = depots;
    }

    public Dossier depots(Set<Depot> depots) {
        this.setDepots(depots);
        return this;
    }

    public Dossier addDepot(Depot depot) {
        this.depots.add(depot);
        depot.getDossiers().add(this);
        return this;
    }

    public Dossier removeDepot(Depot depot) {
        this.depots.remove(depot);
        depot.getDossiers().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Dossier)) {
            return false;
        }
        return id != null && id.equals(((Dossier) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Dossier{" +
            "id=" + getId() +
            ", valider='" + getValider() + "'" +
            "}";
    }
}
