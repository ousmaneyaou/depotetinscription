package ng.campusnig.com.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Inscription.
 */
@Entity
@Table(name = "inscription")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Inscription implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "date_inscription")
    private LocalDate dateInscription;

    @Column(name = "regime")
    private Boolean regime;

    @OneToMany(mappedBy = "inscription")
    @JsonIgnoreProperties(value = { "inscription" }, allowSetters = true)
    private Set<Paiement> paiements = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_inscription__depot",
        joinColumns = @JoinColumn(name = "inscription_id"),
        inverseJoinColumns = @JoinColumn(name = "depot_id")
    )
    @JsonIgnoreProperties(value = { "inscriptions", "dossiers" }, allowSetters = true)
    private Set<Depot> depots = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "inscriptions", "user" }, allowSetters = true)
    private Administration administration;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Inscription id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateInscription() {
        return this.dateInscription;
    }

    public Inscription dateInscription(LocalDate dateInscription) {
        this.setDateInscription(dateInscription);
        return this;
    }

    public void setDateInscription(LocalDate dateInscription) {
        this.dateInscription = dateInscription;
    }

    public Boolean getRegime() {
        return this.regime;
    }

    public Inscription regime(Boolean regime) {
        this.setRegime(regime);
        return this;
    }

    public void setRegime(Boolean regime) {
        this.regime = regime;
    }

    public Set<Paiement> getPaiements() {
        return this.paiements;
    }

    public void setPaiements(Set<Paiement> paiements) {
        if (this.paiements != null) {
            this.paiements.forEach(i -> i.setInscription(null));
        }
        if (paiements != null) {
            paiements.forEach(i -> i.setInscription(this));
        }
        this.paiements = paiements;
    }

    public Inscription paiements(Set<Paiement> paiements) {
        this.setPaiements(paiements);
        return this;
    }

    public Inscription addPaiement(Paiement paiement) {
        this.paiements.add(paiement);
        paiement.setInscription(this);
        return this;
    }

    public Inscription removePaiement(Paiement paiement) {
        this.paiements.remove(paiement);
        paiement.setInscription(null);
        return this;
    }

    public Set<Depot> getDepots() {
        return this.depots;
    }

    public void setDepots(Set<Depot> depots) {
        this.depots = depots;
    }

    public Inscription depots(Set<Depot> depots) {
        this.setDepots(depots);
        return this;
    }

    public Inscription addDepot(Depot depot) {
        this.depots.add(depot);
        depot.getInscriptions().add(this);
        return this;
    }

    public Inscription removeDepot(Depot depot) {
        this.depots.remove(depot);
        depot.getInscriptions().remove(this);
        return this;
    }

    public Administration getAdministration() {
        return this.administration;
    }

    public void setAdministration(Administration administration) {
        this.administration = administration;
    }

    public Inscription administration(Administration administration) {
        this.setAdministration(administration);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Inscription)) {
            return false;
        }
        return id != null && id.equals(((Inscription) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Inscription{" +
            "id=" + getId() +
            ", dateInscription='" + getDateInscription() + "'" +
            ", regime='" + getRegime() + "'" +
            "}";
    }
}
