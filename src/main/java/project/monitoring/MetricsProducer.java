package project.monitoring;

import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author Ramil Rahimkulov
 * @since 23.04.2024
 */
@Component
public class MetricsProducer {

    private final MeterRegistry meterRegistry;

    @Autowired
    public MetricsProducer(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }

    public void pushCreateLessonRequest() {
        meterRegistry
                .counter("requests.createLessonRequest.success")
                .increment(1);
    }
}
