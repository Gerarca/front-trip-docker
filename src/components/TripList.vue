<template>
  <div class="container card p-2 shadow-sm mb-4">
    <div class="row g-3 p-4 mt-4">
      <div class="col-12 col-md-3 text-start fw-bold">
        <label for="filter-start">Inicio:</label>
        <input id="filter-start" v-model="filters.start_gte" type="date" class="form-control">
      </div>
      <div class="col-12 col-md-3 text-start fw-bold">
        <label for="filter-start">Término:</label>
        <input id="filter-start" v-model="filters.start_lte" type="date" class="form-control">
      </div>
      <div class="col-12 col-md-3 text-start fw-bold">
        <label for="filter-distance">Distancia mínima:</label>
        <input id="filter-distance" v-model="filters.distance_gte" type="number" class="form-control">
      </div>
      <div class="col-12 col-md-3 d-flex flex-column justify-content-between text-center fw-bold">
        <div class="mt-auto d-flex justify-content-evenly">
          <button @click="fetchTrips" class="btn btn-primary mt-2 w-40">Buscar</button>
          <button @click="clear" class="btn btn-ligth mt-2 w-40 border border-1">Limpiar</button>
        </div>        
      </div>
    </div>
    <div class="p-4">
      <div class="fs-5 fw-bold my-4">Trips</div>
      <table class="table table-hover mt-4" >
        <thead>
          <tr class="bg-primary text-white custom-header">
            <th scope="col">Inicio</th>
            <th scope="col">Término</th>
            <th scope="col" width="10%">Distancia (km)</th>
            <th scope="col" width="10%">Duración</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="trips.length === 0">
            <td colspan="4" class="text-center my-4">Sin registros</td>
          </tr>
          <tr v-for="trip in trips" :key="trip._id" @click="selectTrip(trip)" style="cursor: pointer;" title="Click para mas detalles">
            <td >
              <p class="text-start"> {{ new Date(trip.start.time).toLocaleString() }} </p> 
              <p class="text-justify"> {{ trip.start.address }} </p>
            </td>
            <td >
              <p class="text-start"> {{ new Date(trip.end.time).toLocaleString() }} </p> 
              <p class="text-justify"> {{ trip.end.address }} </p>
            </td >
            <td class="text-center" >{{ trip.distance.toFixed(2) }}</td>
            <td class="text-center" >{{ (trip.duration / 60000) }} min.</td>
          </tr>         
        </tbody>
      </table>
      
      <nav aria-label="Page navigation example">
        <ul class="pagination  d-flex justify-content-end">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)"> < </a>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
            <a class="page-link " href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)"> > </a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog" aria-labelledby="tripDetailModalLabel" aria-modal="true" style="background: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="tripDetailModalLabel">Detalles del Viaje</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <TripDetail v-if="selectedTrip" :trip="selectedTrip"></TripDetail>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Tooltip } from 'bootstrap';
import TripDetail from './TripDetail.vue';

export default {
  data() {
    return {
      trips: [],
      selectedTrip: null,
      showModal: false,
      filters: {
        start_gte: '',
        start_lte: '',
        distance_gte: '',
        limit: 10,
        offset: 0
      },
      totalTrips: 0,
      currentPage: 1
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalTrips / this.filters.limit);
    }
  },
  mounted() {
    this.initializeTooltips();
  },
  updated() {
    this.initializeTooltips();
  },
  methods: {
    initializeTooltips() {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        new Tooltip(tooltipTriggerEl);
      });
    },
    async fetchTrips() {
      const params = new URLSearchParams({
        ...this.filters,
        start_gte: this.filters.start_gte ? new Date(this.filters.start_gte).getTime() : '',
        start_lte: this.filters.start_lte ? new Date(this.filters.start_lte).getTime() : ''
      }).toString();
      try {
        const response = await axios.get(`${process.env.VUE_APP_SERVER_API}/trips?${params}`);
        this.trips = response.data.trips;
        this.totalTrips = response.data.total;
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    },
    async clear() {
      this.filters = {
        start_gte: '',
        start_lte: '',
        distance_gte: '',
        limit: 10,
        offset: 0
      }
      const params = new URLSearchParams(this.filters).toString();
      try {
        const response = await axios.get(`${process.env.VUE_APP_SERVER_API}/trips?${params}`);
        this.trips = response.data.trips;
        this.totalTrips = response.data.total;
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    },
    selectTrip(trip) {
      this.selectedTrip = trip;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedTrip = null;
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.filters.offset = (page - 1) * this.filters.limit;
        this.fetchTrips();
      }
    }
  },
  components: {
    TripDetail
  },
  created() {
    this.fetchTrips();
  }
};
</script>

<style scoped>
  .text-justify {
      text-align: justify;
  }

  .col, .page-link, .text-start, .text-justify, .text-center {
    font-size: 13px;
  }

  tbody, td, tfoot, th, thead, tr {
    font-size: 14px;
  }

  .custom-header th:first-child {
    border-top-left-radius: 5px;
  }

  .custom-header th:last-child {
    border-top-right-radius: 5px;
  }
  thead th {
    background-color: var(--bs-primary) !important; 
  }

  .btn-primary, .btn-ligth{
    color: rgb(0, 0, 0);
    font-weight: 500;
  }
</style>
