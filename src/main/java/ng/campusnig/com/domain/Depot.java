package ng.campusnig.com.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Depot.
 */
@Entity
@Table(name = "depot")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Depot implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "dossier_valide")
    private Boolean dossierValide;

    @ManyToMany(mappedBy = "depots")
    @JsonIgnoreProperties(value = { "paiements", "depots", "administration" }, allowSetters = true)
    private Set<Inscription> inscriptions = new HashSet<>();

    @ManyToMany(mappedBy = "depots")
    @JsonIgnoreProperties(value = { "niveaus", "campagnes", "depots" }, allowSetters = true)
    private Set<Dossier> dossiers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Depot id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getDossierValide() {
        return this.dossierValide;
    }

    public Depot dossierValide(Boolean dossierValide) {
        this.setDossierValide(dossierValide);
        return this;
    }

    public void setDossierValide(Boolean dossierValide) {
        this.dossierValide = dossierValide;
    }

    public Set<Inscription> getInscriptions() {
        return this.inscriptions;
    }

    public void setInscriptions(Set<Inscription> inscriptions) {
        if (this.inscriptions != null) {
            this.inscriptions.forEach(i -> i.removeDepot(this));
        }
        if (inscriptions != null) {
            inscriptions.forEach(i -> i.addDepot(this));
        }
        this.inscriptions = inscriptions;
    }

    public Depot inscriptions(Set<Inscription> inscriptions) {
        this.setInscriptions(inscriptions);
        return this;
    }

    public Depot addInscription(Inscription inscription) {
        this.inscriptions.add(inscription);
        inscription.getDepots().add(this);
        return this;
    }

    public Depot removeInscription(Inscription inscription) {
        this.inscriptions.remove(inscription);
        inscription.getDepots().remove(this);
        return this;
    }

    public Set<Dossier> getDossiers() {
        return this.dossiers;
    }

    public void setDossiers(Set<Dossier> dossiers) {
        if (this.dossiers != null) {
            this.dossiers.forEach(i -> i.removeDepot(this));
        }
        if (dossiers != null) {
            dossiers.forEach(i -> i.addDepot(this));
        }
        this.dossiers = dossiers;
    }

    public Depot dossiers(Set<Dossier> dossiers) {
        this.setDossiers(dossiers);
        return this;
    }

    public Depot addDossier(Dossier dossier) {
        this.dossiers.add(dossier);
        dossier.getDepots().add(this);
        return this;
    }

    public Depot removeDossier(Dossier dossier) {
        this.dossiers.remove(dossier);
        dossier.getDepots().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Depot)) {
            return false;
        }
        return id != null && id.equals(((Depot) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Depot{" +
            "id=" + getId() +
            ", dossierValide='" + getDossierValide() + "'" +
            "}";
    }
}
