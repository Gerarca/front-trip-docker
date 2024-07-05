<template>
  <div>
    <div v-if="trip">
      <p class="text text-start"><strong>Hora de Inicio:</strong> {{ new Date(trip.start.time).toLocaleString() }}</p>
      <p class="text text-start"><strong>Dirección de Inicio:</strong> {{ trip.start.address }}</p>
      <p class="text text-start"><strong>Hora de Fin:</strong> {{ new Date(trip.end.time).toLocaleString() }}</p>
      <p class="text text-start"><strong>Dirección de Fin:</strong> {{ trip.end.address }}</p>
      <p class="text text-start"><strong>Distancia:</strong> {{ trip.distance.toFixed(2) }} km</p>
      <p class="text text-start"><strong>Duración:</strong> {{ (trip.duration / 60000) }} minutos</p>
      <div ref="map" style="height: 400px;"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    trip: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      if (!this.trip || !this.trip.start || !this.trip.end || !this.trip.start.location || !this.trip.end.location) {
        console.error('Datos incompletos para inicializar el mapa');
        return;
      }

      const { start, end, boundingBox } = this.trip;

      const map = new google.maps.Map(this.$refs.map, {
        zoom: 18,
        center: { lat: start.location.lat, lng: start.location.lon },
      });

      new google.maps.Marker({
        position: { lat: start.location.lat, lng: start.location.lon },
        map: map,
        title: "Inicio del Viaje",
         label: {
          text: "Inicio",
          color: "black",
          fontSize: "16px",
          fontWeight: "bold",
          className: "custom-label"
        }
      });

      new google.maps.Marker({
        position: { lat: end.location.lat, lng: end.location.lon },
        map: map,
        title: "Fin del Viaje",
         label: {
          text: "Fin",
          color: "black",
          fontSize: "16px",
          fontWeight: "bold",
          className: "custom-label"
        }        
      });

      if (boundingBox) {
        new google.maps.Rectangle({
          bounds: {
            north: boundingBox[0][0],
            south: boundingBox[1][0],
            east: boundingBox[1][1],
            west: boundingBox[0][1]
          },
          map: map,
          strokeColor: "rgb(13, 110, 253)",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#6D6E6E",
          fillOpacity: 0.35,
        });
      }
    }
  }
};
</script>

<style scoped>
  .text{
    font-size: 13px;
  }

  .custom-label {
    margin-top: 100px; 
  }
</style>
