package ng.campusnig.com.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Administration.
 */
@Entity
@Table(name = "administration")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Administration implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @OneToMany(mappedBy = "administration")
    @JsonIgnoreProperties(value = { "paiements", "depots", "administration" }, allowSetters = true)
    private Set<Inscription> inscriptions = new HashSet<>();

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Administration id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<Inscription> getInscriptions() {
        return this.inscriptions;
    }

    public void setInscriptions(Set<Inscription> inscriptions) {
        if (this.inscriptions != null) {
            this.inscriptions.forEach(i -> i.setAdministration(null));
        }
        if (inscriptions != null) {
            inscriptions.forEach(i -> i.setAdministration(this));
        }
        this.inscriptions = inscriptions;
    }

    public Administration inscriptions(Set<Inscription> inscriptions) {
        this.setInscriptions(inscriptions);
        return this;
    }

    public Administration addInscription(Inscription inscription) {
        this.inscriptions.add(inscription);
        inscription.setAdministration(this);
        return this;
    }

    public Administration removeInscription(Inscription inscription) {
        this.inscriptions.remove(inscription);
        inscription.setAdministration(null);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Administration user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Administration)) {
            return false;
        }
        return id != null && id.equals(((Administration) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Administration{" +
            "id=" + getId() +
            "}";
    }
}
