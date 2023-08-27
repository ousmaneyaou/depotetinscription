package ng.campusnig.com.domain;

import static org.assertj.core.api.Assertions.assertThat;

import ng.campusnig.com.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BachelierTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bachelier.class);
        Bachelier bachelier1 = new Bachelier();
        bachelier1.setId(1L);
        Bachelier bachelier2 = new Bachelier();
        bachelier2.setId(bachelier1.getId());
        assertThat(bachelier1).isEqualTo(bachelier2);
        bachelier2.setId(2L);
        assertThat(bachelier1).isNotEqualTo(bachelier2);
        bachelier1.setId(null);
        assertThat(bachelier1).isNotEqualTo(bachelier2);
    }
}
