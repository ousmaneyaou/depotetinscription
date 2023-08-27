package ng.campusnig.com.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;

/**
 * A Paiement.
 */
@Entity
@Table(name = "paiement")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Paiement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "date_paie")
    private LocalDate datePaie;

    @Column(name = "etat")
    private Boolean etat;

    @ManyToOne
    @JsonIgnoreProperties(value = { "paiements", "depots", "administration" }, allowSetters = true)
    private Inscription inscription;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Paiement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDatePaie() {
        return this.datePaie;
    }

    public Paiement datePaie(LocalDate datePaie) {
        this.setDatePaie(datePaie);
        return this;
    }

    public void setDatePaie(LocalDate datePaie) {
        this.datePaie = datePaie;
    }

    public Boolean getEtat() {
        return this.etat;
    }

    public Paiement etat(Boolean etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(Boolean etat) {
        this.etat = etat;
    }

    public Inscription getInscription() {
        return this.inscription;
    }

    public void setInscription(Inscription inscription) {
        this.inscription = inscription;
    }

    public Paiement inscription(Inscription inscription) {
        this.setInscription(inscription);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Paiement)) {
            return false;
        }
        return id != null && id.equals(((Paiement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Paiement{" +
            "id=" + getId() +
            ", datePaie='" + getDatePaie() + "'" +
            ", etat='" + getEtat() + "'" +
            "}";
    }
}
